use web3::{
    ethabi::{Contract, Log, RawLog},
    transports::WebSocket,
    types::{Block, BlockId, BlockNumber, Transaction, TransactionReceipt, H256},
    Web3,
};

pub struct OraculConf {
    pub eth_api_url: String,
    pub contract_address: String,
    pub contract: web3::ethabi::Contract,
}

#[derive(Debug)]
pub struct TransferFraudReported {
    pub token_id: u64,
    pub decided: bool,
    pub approved: bool,
}

async fn get_tx_receipt(hash: H256, web3: &Web3<WebSocket>) -> Result<TransactionReceipt, ()> {
    if let Some(tx) = match web3.eth().transaction_receipt(hash).await {
        Ok(tx) => tx,
        Err(_) => return Err(()),
    } {
        Ok(tx)
    } else {
        Err(())
    }
}

pub async fn get_event_logs(
    event_name: &str,
    hash: H256,
    web3: &Web3<WebSocket>,
    cont: &Contract,
) -> Result<Log, ()> {
    let tx = get_tx_receipt(hash, web3).await?;

    if tx.logs.is_empty() {
        return Err(());
    }

    let event = match cont.event(event_name) {
        Ok(e) => e,
        Err(_) => return Err(()),
    };

    match event.parse_log(RawLog {
        topics: tx.logs[0]
            .topics
            .iter()
            .map(|x| H256::from_slice(x.as_bytes()))
            .collect(),
        data: Vec::from(tx.logs[0].data.0.as_slice()),
    }) {
        Ok(p) => Ok(p),
        Err(_) => Err(()),
    }
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
