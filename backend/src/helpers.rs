use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use std::env;
use web3::{
    contract::tokens::Tokenizable,
    ethabi::{Contract, Log, RawLog},
    transports::WebSocket,
    types::{Block, BlockId, BlockNumber, Transaction, TransactionReceipt, H160, H256, U256},
    Web3,
};

pub struct OraculConf {
    pub eth_api_url: String,
    pub mark_3d_collection_contract: web3::ethabi::Contract,
    pub mark_3d_collection_address: String,
    pub fraud_decider_web2_contract: web3::ethabi::Contract,
    pub fraud_decider_web2_address: String,
    pub fraud_decider_web2_key: SecretKey,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct File {
    name: String,
    description: String,
    image: String,
    pub hidden_file: String,
}

#[derive(Debug)]
pub struct TransferFraudReported {
    pub token_id: u64,
    pub decided: bool,
    pub approved: bool,
}

#[derive(Debug)]
pub struct FraudReported {
    pub collection: H160,
    pub token_id: U256,
    pub cid: String,
    pub public_key: Vec<u8>,
    pub private_key: Vec<u8>,
    pub encrypted_password: Vec<u8>,
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

pub async fn get_event_logs(
    event_name: &str,
    hash: H256,
    web3: &Web3<WebSocket>,
    cont: &Contract,
) -> Result<Log, web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;

    if tx.logs.is_empty() {
        return Err(web3::Error::Internal);
    }

    let event = match cont.event(event_name) {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };

    for i in 0..tx.logs.len() {
        if let Ok(p) = event.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            return Ok(p);
        }
    }
    Err(web3::Error::Decoder("no logs".to_string()))
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
