use web3::futures::{future, StreamExt};

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

    let mut blocks = web3.eth_subscribe().subscribe_new_heads().await?;

    let mut c = 0;
    while let Some(b) = blocks.next().await {
        c += 1;
        let block = b?;
        println!("{c}\n\n{block:#?}\n");
    }

    // blocks
    //     .for_each_concurrent(1, |b| async move {
    //         println!("{:#?}", b);
    //         Ok(())
    //     })
    //     .await?;

    // (&mut blocks)
    //     .take(15)
    //     .for_each(|x| {
    //         println!("{:#?}", x);
    //         future::ready(())
    //     })
    //     .await;

    Ok(())
}
