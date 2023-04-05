use crate::structs::{CollectionCreation, File, FraudReported, TransferFraudReported};
use aes::{
    cipher::{block_padding::Pkcs7, BlockDecrypt, BlockDecryptMut, KeyInit, KeyIvInit},
    Aes256,
};
use generic_array::GenericArray;
use openssl::{
    pkey::Private,
    rsa::{Padding, Rsa},
};
use redis::{aio::Connection, AsyncCommands};
use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256, Sha512};
use std::{collections::HashSet, env, error::Error, str::FromStr};
use web3::{
    contract::Options,
    ethabi::{Contract, Log, RawLog},
    signing::Key,
    transports::Http,
    types::{
        Address, Block, BlockId, BlockNumber, Index, Transaction, TransactionReceipt, H160, H256,
    },
    Transport, Web3,
};

pub async fn add_in_set(
    con: &mut Connection,
    address: H160,
    set: &mut HashSet<String>,
) -> Result<(), Box<dyn Error>> {
    let addr = format!("0x{address:x}");
    con.sadd("collections", &addr).await?;
    set.insert(addr);
    Ok(())
}

pub async fn get_contract(env_var: &str) -> web3::ethabi::Contract {
    let abi_bytes =
        tokio::fs::read(env::var(env_var).unwrap_or_else(|_| panic!("env err ({env_var})")))
            .await
            .expect("invalid hex");

    let full_json_with_abi: serde_json::Value =
        serde_json::from_slice(&abi_bytes).expect("parse json abi failed");

    let x = serde_json::to_vec(full_json_with_abi.get("abi").expect("create abi bytes err"))
        .expect("create abi err");

    web3::ethabi::Contract::load(&*x).expect("load contract err")
}

async fn get_tx_receipt(hash: H256, web3: &Web3<Http>) -> Result<TransactionReceipt, web3::Error> {
    if let Some(tx) = match web3.eth().transaction_receipt(hash).await {
        Ok(tx) => tx,
        Err(e) => return Err(e),
    } {
        Ok(tx)
    } else {
        Err(web3::Error::Internal)
    }
}

pub async fn get_collection_creation_event(
    hash: H256,
    web3: &Web3<Http>,
    cont: &Contract,
) -> Result<CollectionCreation, web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;
    if tx.logs.is_empty() {
        return Err(web3::Error::Internal);
    }

    let event_c_c = match cont.event("CollectionCreation") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };

    let mut c_c_log: Log = Log { params: vec![] };
    for i in 0..tx.logs.len() {
        if let Ok(log) = event_c_c.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            c_c_log = log;
        }
    }

    Ok(CollectionCreation::from_log(c_c_log))
}

pub async fn get_events(
    hash: H256,
    web3: &Web3<Http>,
    collection: &Contract,
    fraud_decider: &Contract,
) -> Result<(TransferFraudReported, FraudReported), web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;
    if tx.logs.len() < 2 {
        return Err(web3::Error::Internal);
    }

    let event_t_f_r = match collection.event("TransferFraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };

    let event_f_r = match fraud_decider.event("FraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };

    let mut t_f_r_log: Log = Log { params: vec![] };
    let mut f_r_log: Log = Log { params: vec![] };
    let mut left_events: i32 = 2;
    for i in 0..tx.logs.len() {
        if let Ok(log) = event_t_f_r.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            left_events -= 1;
            t_f_r_log = log;
        }

        if let Ok(log) = event_f_r.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            left_events -= 1;
            f_r_log = log;
        }
    }
    if left_events != 0 {
        return Err(web3::Error::Decoder(format!("events not found")));
    }

    Ok((
        TransferFraudReported::from_log(t_f_r_log),
        FraudReported::from_log(f_r_log),
    ))
}

pub fn decrypt_password(
    private_key: &Rsa<Private>,
    report: &FraudReported,
) -> Result<Vec<u8>, web3::Error> {
    let mut buf: Vec<u8> = vec![0; private_key.size() as usize];

    let res_size = match private_key.private_decrypt(
        &report.encrypted_password,
        &mut buf,
        Padding::PKCS1_OAEP,
    ) {
        Ok(v) => v,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
    };

    return Ok(Vec::from(&buf[..res_size]));
}

pub async fn fetch_file(report: &FraudReported) -> Result<Vec<u8>, web3::Error> {
    let link = if report.cid.starts_with("ipfs://") {
        format!(
            "https://gateway.lighthouse.storage/ipfs/{}",
            report.cid.replace("ipfs://", "")
        )
    } else {
        return Err(web3::Error::Decoder("invalid cid".to_string()));
    };

    let file: File = match reqwest::Client::new().get(link).send().await {
        Ok(r) => match r.json().await {
            Ok(f) => f,
            Err(e) => {
                return Err(web3::Error::Decoder(format!(
                    "convert file in JSON error: {e}"
                )))
            }
        },
        Err(e) => return Err(web3::Error::Decoder(format!("get file in JSON error: {e}"))),
    };

    let hidden_file_link = if file.hidden_file.starts_with("ipfs://") {
        format!(
            "https://gateway.lighthouse.storage/ipfs/{}",
            file.hidden_file.replace("ipfs://", "")
        )
    } else {
        return Err(web3::Error::Decoder("invalid hidden file link".to_string()));
    };

    match reqwest::Client::new().get(hidden_file_link).send().await {
        Ok(r) => match r.bytes().await {
            Ok(b) => Ok(b.to_vec()),
            Err(e) => Err(web3::Error::Decoder(format!(
                "convert hidden file to bytes error: {e}"
            ))),
        },
        Err(e) => Err(web3::Error::Decoder(format!("get hidden file error: {e}"))),
    }
}

pub fn decrypt_file(file: &[u8], key_bytes: &[u8]) -> Result<bool, web3::Error> {
    let cipher = match Aes256::new_from_slice(&key_bytes) {
        Ok(c) => c,
        Err(e) => {
            return Err(web3::Error::Decoder(format!("parse key failed: {e}")));
        }
    };
    let mut decrypted: Vec<u8> = vec![0; file.len()];

    for i in 0..file.len() / 16 {
        let mut block: Vec<u8> = vec![0; 16];
        block.clone_from_slice(&file[i * 16..(i + 1) * 16]);

        cipher.decrypt_block(GenericArray::from_mut_slice(block.as_mut_slice()));

        decrypted[i * 16..(i + 1) * 16].copy_from_slice(block.as_slice());
    }

    let hash = &decrypted[decrypted.len() - 32..];
    let mut hasher = Sha256::new();
    hasher.update(&decrypted[..decrypted.len() - 32]);
    let res = hasher.finalize();
    let result = res.as_slice();

    Ok(result == hash)
}

////
// AES-256_CBC
fn decrypt_aes256cbc(data: &[u8], key_bytes: &[u8], iv: &[u8]) -> Result<Vec<u8>, web3::Error> {
    type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;

    let cipher = match Aes256CbcDec::new_from_slices(&key_bytes, &iv) {
        Ok(c) => c,
        Err(e) => return Err(web3::Error::Decoder(format!("parse key failed: {e}"))),
    };

    let mut dec_buffer = vec![0u8; data.len()];
    dec_buffer[..data.len()].copy_from_slice(&data);

    let decrypted = match cipher.decrypt_padded_b2b_mut::<Pkcs7>(&data, &mut dec_buffer) {
        Ok(d) => d.to_vec(),
        Err(e) => return Err(web3::Error::Decoder(format!("decryption failed: {e}"))),
    };

    Ok(decrypted)
}

pub fn verify_file_integrity(file: &[u8], key_bytes: &[u8]) -> Result<bool, web3::Error> {
    // iv(16b) | SHA-512(64b) | encryptedData
    let iv_padding = 16;
    let hash_padding = 64;

    let iv = &file[..iv_padding];
    let hash = &file[iv_padding..hash_padding + iv_padding];
    let encrypted = &file[hash_padding + iv_padding..];

    let decrypted = match decrypt_aes256cbc(&encrypted, &key_bytes, &iv) {
        Ok(d) => d,
        Err(e) => return Err(web3::Error::Decoder(format!("decryption failed: {e}"))),
    };

    let mut hasher = Sha512::new();
    hasher.update(&decrypted);
    let res = hasher.finalize();
    let result = res.as_slice();

    Ok(result == hash)
}

/// Description of a Transaction, pending or in the chain.
#[derive(Debug, Default, Clone, PartialEq, Deserialize, Serialize)]
pub struct TransactionNoExtraData {
    /// Hash
    pub hash: H256,
    /// Transaction Index. None when pending.
    #[serde(rename = "transactionIndex")]
    pub transaction_index: Option<Index>,
    /// Sender
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from: Option<Address>,
    /// Recipient (None when contract creation)
    pub to: Option<Address>,
}

/// The block type returned from RPC calls.
/// This is generic over a `TX` type.
#[derive(Debug, Default, Clone, PartialEq, Deserialize, Serialize)]
pub struct BlockNoExtraData<TX> {
    /// Hash of the block
    pub hash: Option<web3::types::H256>,
    /// Block number. None if pending.
    pub number: Option<web3::types::U64>,
    /// Transactions
    pub transactions: Vec<TX>,
}

pub async fn get_latest_block_num(web3: &Web3<Http>) -> Result<u64, web3::Error> {
    let block = web3
        .eth()
        .block(BlockId::Number(BlockNumber::Latest))
        .await?;
    let block = match block {
        Some(b) => b,
        None => return Err(web3::Error::Internal),
    };
    match block.number {
        Some(n) => Ok(n.as_u64()),
        None => Err(web3::Error::Internal),
    }
}

pub async fn get_latest_block_num_no_extra(
    transport: &web3::transports::Http,
) -> Result<u64, web3::Error> {
    let result = transport
        .execute(
            "eth_getBlockByNumber",
            vec![
                Value::String(String::from_str("latest").unwrap()),
                Value::Bool(false),
            ],
        )
        .await?;
    match result.get("error") {
        Some(value) => {
            log::error!("failed to get latest block number: {}", value.to_string());
            return Err(web3::Error::Internal);
        }
        None => (),
    }
    let block: BlockNoExtraData<web3::types::H256> = match serde_json::from_value(result) {
        Ok(b) => b,
        Err(e) => {
            log::error!("failed to get latest block number: {}", e);
            return Err(web3::Error::Internal);
        }
    };

    match block.number {
        Some(n) => Ok(n.as_u64()),
        None => Err(web3::Error::Internal),
    }
}

pub async fn get_block(
    block_num: u64,
    web3: &Web3<Http>,
) -> Result<Block<Transaction>, web3::Error> {
    let block_num: [u64; 1] = [block_num];
    let block = web3
        .eth()
        .block_with_txs(BlockId::Number(BlockNumber::Number(web3::types::U64(
            block_num,
        ))))
        .await;

    let block = match block {
        Ok(b) => b,
        Err(e) => return Err(e),
    };
    match block {
        Some(b) => Ok(b),
        None => Err(web3::Error::Internal),
    }
}

pub async fn get_block_no_extra(
    block_num: u64,
    transport: &web3::transports::Http,
) -> Result<BlockNoExtraData<TransactionNoExtraData>, web3::Error> {
    let block_num: [u64; 1] = [block_num];
    let result = transport
        .execute(
            "eth_getBlockByNumber",
            vec![
                serde_json::to_value(BlockId::Number(BlockNumber::Number(web3::types::U64(
                    block_num,
                ))))
                .unwrap(),
                Value::Bool(true),
            ],
        )
        .await?;
    match result.get("error") {
        Some(value) => {
            log::error!("failed to get block: {}", value.to_string());
            return Err(web3::Error::Internal);
        }
        None => (),
    }
    let block: BlockNoExtraData<TransactionNoExtraData> = match serde_json::from_value(result) {
        Ok(b) => b,
        Err(e) => {
            log::error!("failed to get latest block number: {}", e);
            return Err(web3::Error::Internal);
        }
    };
    Ok(block)
}

pub async fn call_late_decision(
    transport: &web3::transports::Http,
    contract: &web3::contract::Contract<Http>,
    approved: bool,
    report: &FraudReported,
    key: &SecretKey,
) -> Result<web3::types::H256, web3::Error> {
    let params = (
        web3::ethabi::Token::Address(report.collection),
        web3::ethabi::Token::Uint(report.token_id),
        web3::ethabi::Token::Bool(approved),
    );
    let gas = match contract
        .estimate_gas(
            "lateDecision",
            params,
            key.address(),
            web3::contract::Options::default(),
        )
        .await
    {
        Ok(g) => g,
        Err(_) => return Err(web3::Error::Internal),
    };
    let max_fee_per_gas_result = transport
        .execute("eth_maxPriorityFeePerGas", vec![])
        .await?;
    match max_fee_per_gas_result.get("error") {
        Some(value) => {
            log::error!(
                "failed to get max priority fee per gas: {}",
                value.to_string()
            );
            return Err(web3::Error::Internal);
        }
        None => (),
    };
    let max_priority_fee_per_gas: web3::types::U256 =
        match serde_json::from_value(max_fee_per_gas_result) {
            Ok(b) => b,
            Err(e) => {
                log::error!("failed to parse max priority fee per gas: {}", e);
                return Err(web3::Error::Internal);
            }
        };

    let opts = Options {
        gas: Some(gas),
        transaction_type: Some(2.into()),
        max_priority_fee_per_gas: Some(max_priority_fee_per_gas),
        ..Default::default()
    };
    contract
        .signed_call(
            "lateDecision",
            (
                web3::ethabi::Token::Address(report.collection),
                web3::ethabi::Token::Uint(report.token_id),
                web3::ethabi::Token::Bool(approved),
            ),
            opts,
            key,
        )
        .await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decrypt_aes256cbc() {
        let data = [
            0xE0, 0xC7, 0xCF, 0x54, 0xA3, 0xC2, 0xA6, 0xA2, 0x25, 0x2B, 0xD5, 0x4E, 0xA9, 0xFD,
            0x8D, 0xF7,
        ]
        .to_vec();
        let key = *b"12345678901234567890123456789012";
        let iv = *b"1234567890123456";
        let expected = *b"hello world";

        let result = decrypt_aes256cbc(&data, &key, &iv).unwrap();
        assert_eq!(result, expected);
    }

    #[test]
    fn test_verify_file_integrity() {
        let key = [
            0xd2, 0xf1, 0xd9, 0x6f, 0x9c, 0x4f, 0x52, 0x86, 0xee, 0x9c, 0xa3, 0x4c, 0xf8, 0x0b,
            0x9b, 0xe8, 0x15, 0x45, 0xae, 0xbf, 0x71, 0x9b, 0xab, 0x08, 0x40, 0x0c, 0xc2, 0xb9,
            0xf8, 0x01, 0xab, 0xcb,
        ]
        .to_vec(); // d2f1d96f9c4f5286ee9ca34cf80b9be81545aebf719bab08400cc2b9f801abcb
        let data = [
            0x16, 0x65, 0xc8, 0x5c, 0x10, 0x0a, 0xb0, 0xa6, 0xa1, 0xcf, 0x32, 0xd3, 0x3c, 0x9e,
            0xdc, 0x64, 0x61, 0x57, 0x2c, 0xd0, 0xa9, 0xf6, 0x3f, 0x18, 0x67, 0x3a, 0x3c, 0x9d,
            0x16, 0x22, 0xbd, 0x90, 0x7c, 0x97, 0xf5, 0xd1, 0x16, 0x50, 0x57, 0xda, 0xbc, 0xc6,
            0xc6, 0x85, 0x6e, 0x30, 0xae, 0xb2, 0xa6, 0x0b, 0x37, 0x9c, 0xa5, 0xc5, 0xc9, 0xb2,
            0xea, 0xc0, 0x3c, 0xab, 0xb3, 0xbe, 0xa9, 0x32, 0x22, 0x64, 0x59, 0xaf, 0xf9, 0x5a,
            0x1d, 0xb4, 0x3a, 0x3d, 0x94, 0xa9, 0xc6, 0xb6, 0x65, 0xe9, 0x0f, 0x94, 0xeb, 0x5b,
            0xb0, 0x19, 0x21, 0x36, 0x98, 0x35, 0x1c, 0x74, 0x59, 0x19, 0x22, 0x1a, 0xa5, 0xf1,
            0xb5, 0x73, 0xea, 0x5d, 0x5a, 0x43, 0x53, 0xa8, 0x83, 0x03, 0xa2, 0xe4, 0x43, 0xab,
            0x58, 0x88, 0x9b, 0x14, 0x4c, 0x16, 0x41, 0x4b, 0x94, 0xb1, 0xc0, 0x55, 0x98, 0x24,
            0x17, 0x85,
        ]
        .to_vec(); // 1665c85c100ab0a6a1cf32d33c9edc6461572cd0a9f63f18673a3c9d1622bd907c97f5d1165057dabcc6c6856e30aeb2a60b379ca5c5c9b2eac03cabb3bea932226459aff95a1db43a3d94a9c6b665e90f94eb5bb019213698351c745919221aa5f1b573ea5d5a4353a88303a2e443ab58889b144c16414b94b1c05598241785

        let ok = verify_file_integrity(&data, &key).unwrap();

        assert!(ok);
    }
}
