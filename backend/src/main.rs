use web3::futures::StreamExt;
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

    let mut block_stream = web3.eth_subscribe().subscribe_new_heads().await?;

    loop {
        match block_stream.next().await {
            Some(Ok(b)) => println!("{:#?}", b),
            None => continue,
            Some(Err(e)) => panic!("{}", e),
        }
    }
}
