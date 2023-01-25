use web3::{
    types::{BlockId, BlockNumber},
};
use env_logger;

#[tokio::main]
async fn main() {
    env_logger::init();

    let url = "https://api.hyperspace.node.glif.io/rpc/v1";
    let transport = web3::transports::Http::new(url).unwrap();
    let web3 = web3::Web3::new(transport);

    let block = match web3.eth().block(BlockId::Number(BlockNumber::Latest)).await {
        Ok(b) => b,
        Err(e) => panic!("{:}", e),
    };
    let block = match block {
        Some(b) => b,
        None => panic!("none"),
    };
    println!("{:?}", block);
}