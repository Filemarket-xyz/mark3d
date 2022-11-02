use web3::types::{BlockId, BlockNumber, TransactionId};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to read .env file");

    let web3 = web3::Web3::new(
        web3::transports::Http::new(&std::env::var("ETH_API_URL").unwrap()).unwrap(),
    );

    let latest_block = web3
        .eth()
        .block(BlockId::Number(BlockNumber::Latest))
        .await
        .unwrap()
        .unwrap();

    for transaction_hash in latest_block.transactions {
        if let Ok(Some(eth_tx)) = web3
            .eth()
            .transaction(TransactionId::Hash(transaction_hash))
            .await
        {
            println!("{:#?}", eth_tx);
        } else {
            println!("An error occurred.");
            continue;
        }
    }
}
