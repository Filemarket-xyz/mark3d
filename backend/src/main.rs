mod helpers;

use helpers::{get_block, get_event_logs, get_latest_block_num, OraculConf, TransferFraudReported};
use std::env;

#[tokio::main]
async fn main() -> Result<(), web3::Error> {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: env::var("ETH_API_URL").expect("env err"),
        contract_address: {
            let mut addr = env::var("CONTRACT_ADDRESS")
                .expect("env err")
                .to_lowercase();
            if !addr.starts_with("0x") {
                addr = format!("0x{}", addr);
            }
            addr
        },
        contract: {
            let abi_bytes = tokio::fs::read(env::var("ABI_PATH").expect("env err (ABI_PATH)"))
                .await
                .expect("invalid hex");

            let full_json_with_abi: serde_json::Value =
                serde_json::from_slice(&abi_bytes).expect("parse json abi failed");

            let x =
                serde_json::to_vec(full_json_with_abi.get("abi").expect("create abi bytes err"))
                    .expect("create abi err");

            web3::ethabi::Contract::load(&*x).expect("load contract err")
        },
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

            for tx in block.transactions {
                if format!(
                    "0x{:x}",
                    match tx.to {
                        Some(to) => to,
                        None => {
                            continue;
                        }
                    }
                ) != conf.contract_address
                {
                    continue;
                }

                let tx_logs =
                    match get_event_logs("TransferFraudReported", tx.hash, &web3, &conf.contract)
                        .await
                    {
                        Ok(r) => r,
                        Err(_) => continue,
                    };

                let mut report = TransferFraudReported {
                    token_id: 0,
                    decided: false,
                    approved: false,
                };

                for log in tx_logs.params {
                    match log.name.as_str() {
                        "tokenId" => match log.value {
                            web3::ethabi::Token::Uint(u) => report.token_id = u.as_u64(),
                            _ => continue,
                        },
                        "decided" => match log.value {
                            web3::ethabi::Token::Bool(b) => report.decided = b,
                            _ => continue,
                        },
                        "approved" => match log.value {
                            web3::ethabi::Token::Bool(b) => report.approved = b,
                            _ => continue,
                        },
                        &_ => continue,
                    }
                }

                println!("{:#?}", report);
            }

            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}
