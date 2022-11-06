use web3::{
    transports::WebSocket,
    types::{Block, BlockId, BlockNumber, Transaction},
    Web3,
};

struct OraculConf {
    eth_api_url: String,
    // contract_address: String,
}

#[tokio::main]
async fn main() -> Result<(), web3::Error> {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: std::env::var("ETH_API_URL").expect("env err"),
        // contract_address: std::env::var("CONTRACT_ADDRESS").expect("env err"),
    };

    let web3 = web3::Web3::new(web3::transports::WebSocket::new(&conf.eth_api_url).await?);
    let mut old_block_num: u64 = match get_latest_block_num(&web3).await {
        Ok(n) => n,
        Err(e) => return Err(e),
    };

    loop {
        let new_block_num: u64 = match get_latest_block_num(&web3).await {
            Ok(n) => {
                if n == old_block_num {
                    tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
                    continue;
                } else {
                    n
                }
            }
            Err(_) => continue,
        };

        for i in old_block_num + 1..=new_block_num {
            let block = match get_block(i, &web3).await {
                Ok(b) => b,
                Err(_) => continue,
            };

            println!("BLOCK: {:#?}", block);

            for tx in block.transactions {
                println!("TX: {:#?}", tx);
            }

            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}

async fn get_latest_block_num(web3: &Web3<WebSocket>) -> Result<u64, web3::Error> {
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
        None => return Err(web3::Error::Internal),
    }
}

async fn get_block(
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
        None => return Err(web3::Error::Internal),
    }
}
