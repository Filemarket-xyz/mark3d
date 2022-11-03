use web3::types::{BlockId, BlockNumber};

struct OraculConf {
    eth_api_url: String,
    contract_address: String,
}

#[tokio::main]
async fn main() -> Result<(), web3::Error> {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: std::env::var("ETH_API_URL").expect("env err"),
        contract_address: std::env::var("CONTRACT_ADDRESS").expect("env err"),
    };

    let web3 = web3::Web3::new(
        web3::transports::WebSocket::new(&conf.eth_api_url)
            .await
            .unwrap(),
    );

    let latest_block = web3
        .eth()
        .block(BlockId::Number(BlockNumber::Latest))
        .await
        .unwrap()
        .unwrap();

    for transaction_hash in latest_block.transactions {
        if let Ok(Some(eth_tx)) = web3.eth().transaction_receipt(transaction_hash).await {
            if let Some(to) = eth_tx.to {
                let to: String = format!("{:x}", to);
                println!("{}", to);
            } else {
                continue;
            }
        } else {
            println!("An error occurred.");
            continue;
        }
    }

    let mut block_stream = web3.eth_subscribe().subscribe_new_heads().await?;
    println!("{:?}", (&mut block_stream).take(5));

    Ok(())
}
