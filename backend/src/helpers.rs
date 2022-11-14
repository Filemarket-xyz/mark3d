use crate::structs::{CollectionCreation, File, FraudReported, TransferFraudReported};
use aes::{
    cipher::{BlockDecrypt, KeyInit},
    Aes256,
};
use generic_array::GenericArray;
use openssl::{
    hash::MessageDigest,
    pkcs5::pbkdf2_hmac,
    pkey::Private,
    rsa::{Padding, Rsa},
};
use redis::{aio::Connection, AsyncCommands};
use secp256k1::SecretKey;
use sha2::{Digest, Sha256};
use std::{collections::HashSet, env, error::Error};
use web3::{
    contract::tokens::Tokenizable,
    ethabi::{Contract, Log, RawLog},
    transports::WebSocket,
    types::{Block, BlockId, BlockNumber, Transaction, TransactionReceipt, H160, H256},
    Web3,
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

async fn get_tx_receipt(
    hash: H256,
    web3: &Web3<WebSocket>,
) -> Result<TransactionReceipt, web3::Error> {
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
    web3: &Web3<WebSocket>,
    cont: &Contract,
) -> Result<CollectionCreation, web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;
    if tx.logs.is_empty() {
        return Err(web3::Error::Internal);
    }

    let event_c_c = match cont.event("CollectionCreation") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
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
    web3: &Web3<WebSocket>,
    cont: &Contract,
) -> Result<(TransferFraudReported, FraudReported), web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;
    if tx.logs.len() != 2 {
        return Err(web3::Error::Internal);
    }

    let event_t_f_r = match cont.event("TransferFraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
    };

    let event_f_r = match cont.event("FraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
    };

    let mut t_f_r_log: Log = Log { params: vec![] };
    let mut f_r_log: Log = Log { params: vec![] };
    let mut f_r_idx: usize = 1;
    for i in 0..tx.logs.len() {
        if let Ok(log) = event_t_f_r.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            f_r_idx -= i;
            t_f_r_log = log;
        }

        if let Ok(log) = event_f_r.parse_log(RawLog {
            topics: tx.logs[f_r_idx]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[f_r_idx].data.0.as_slice()),
        }) {
            f_r_log = log;
        } else {
            return Err(web3::Error::Internal);
        }
    }

    Ok((
        TransferFraudReported::from_log(t_f_r_log),
        FraudReported::from_log(f_r_log),
    ))
}

pub fn decrypt_password(
    private_key: &Rsa<Private>,
    report: &FraudReported,
) -> Result<String, web3::Error> {
    let mut buf: Vec<u8> = vec![0; private_key.size() as usize];

    let res_size = match private_key.private_decrypt(
        &report.encrypted_password,
        &mut buf,
        Padding::PKCS1_OAEP,
    ) {
        Ok(v) => v,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
    };

    match std::str::from_utf8(&buf[..res_size]) {
        Ok(s) => Ok(s.to_string()),
        Err(e) => Err(web3::Error::Decoder(format!("{e}"))),
    }
}

pub async fn fetch_file(report: &FraudReported) -> Result<Vec<u8>, web3::Error> {
    let link = if report.cid.starts_with("ipfs://") {
        format!(
            "https://nftstorage.link/ipfs/{}",
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
            "https://nftstorage.link/ipfs/{}",
            report.cid.replace("ipfs://", "")
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

pub fn decrypt_file(file: &[u8], password: &str) -> Result<bool, web3::Error> {
    let salt = "salt";
    let mut buf: Vec<u8> = vec![0; 32];
    if let Err(e) = pbkdf2_hmac(
        password.as_bytes(),
        salt.as_bytes(),
        1,
        MessageDigest::sha512(),
        &mut buf,
    ) {
        return Err(web3::Error::Decoder(format!("make key failed: {e}")));
    };
    let key_bytes = buf.clone();

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

    Ok(result != hash)
}

pub async fn get_latest_block_num(web3: &Web3<WebSocket>) -> Result<u64, web3::Error> {
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

pub async fn get_block(
    block_num: u64,
    web3: &Web3<WebSocket>,
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

pub async fn call_late_decision(
    contract: &web3::contract::Contract<WebSocket>,
    approved: bool,
    report: &FraudReported,
    key: &SecretKey,
) -> Result<web3::types::TransactionReceipt, web3::error::Error> {
    contract
        .signed_call_with_confirmations(
            "lateDecision",
            vec![
                report.collection.into_token(),
                report.token_id.into_token(),
                approved.into_token(),
            ],
            web3::contract::Options::default(),
            3,
            key,
        )
        .await
}
