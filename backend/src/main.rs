mod helpers;

use helpers::{
    get_block, get_contract, get_event_logs, get_latest_block_num, FraudReported, OraculConf,
    TransferFraudReported,
};
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
        mark_3d_collection_contract: get_contract("MARK_3D_COLLECTION_PATH").await,
        fraud_decider_web2_contract: get_contract("FRAUD_DECIDER_WEB2_PATH").await,
    };

    let web3 = web3::Web3::new(web3::transports::WebSocket::new(&conf.eth_api_url).await?);
    let mut old_block_num: u64 = match get_latest_block_num(&web3).await {
        Ok(n) => n,
        Err(e) => return Err(e),
    };

    // TransferFraudReported listening
    loop {
        // get latest block
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

        // blocks enumeration (from old to latest)
        for i in old_block_num + 1..=new_block_num {
            let block = match get_block(i, &web3).await {
                Ok(b) => b,
                Err(_) => continue,
            };

            // TX enumeration
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

                // try fetch TransferFraudReported event from Mark3dCollection contract
                let tx_logs = match get_event_logs(
                    "TransferFraudReported",
                    tx.hash,
                    &web3,
                    &conf.mark_3d_collection_contract,
                )
                .await
                {
                    Ok(r) => r,
                    Err(_) => continue,
                };

                let mut report_flag = TransferFraudReported {
                    token_id: 0,
                    decided: false,
                    approved: false,
                };

                for log in tx_logs.params {
                    match log.name.as_str() {
                        "tokenId" => match log.value {
                            web3::ethabi::Token::Uint(u) => report_flag.token_id = u.as_u64(),
                            _ => continue,
                        },
                        "decided" => match log.value {
                            web3::ethabi::Token::Bool(b) => report_flag.decided = b,
                            _ => continue,
                        },
                        "approved" => match log.value {
                            web3::ethabi::Token::Bool(b) => report_flag.approved = b,
                            _ => continue,
                        },
                        &_ => continue,
                    }
                }

                // try fetch FraudReported event from FraudDeciderWeb2 contract
                let tx_logs = match get_event_logs(
                    "FraudReported",
                    tx.hash,
                    &web3,
                    &conf.fraud_decider_web2_contract,
                )
                .await
                {
                    Ok(r) => r,
                    Err(_) => continue,
                };

                let mut report = FraudReported {
                    collection: String::new(),
                    token_id: 0,
                    cid: String::new(),
                    public_key: vec![],
                    private_key: vec![],
                    encrypted_password: vec![],
                };

                for log in tx_logs.params {
                    match log.name.as_str() {
                        "collection" => match log.value {
                            web3::ethabi::Token::String(s) => report.collection = s,
                            _ => continue,
                        },
                        "tokenId" => match log.value {
                            web3::ethabi::Token::Uint(u) => report.token_id = u.as_u64(),
                            _ => continue,
                        },
                        "cid" => match log.value {
                            web3::ethabi::Token::String(s) => report.cid = s,
                            _ => continue,
                        },
                        "publicKey" => match log.value {
                            web3::ethabi::Token::Bytes(b) => report.public_key = b,
                            _ => continue,
                        },
                        "privateKey" => match log.value {
                            web3::ethabi::Token::Bytes(b) => report.private_key = b,
                            _ => continue,
                        },
                        "encryptedPassword" => match log.value {
                            web3::ethabi::Token::Bytes(b) => report.encrypted_password = b,
                            _ => continue,
                        },
                        &_ => continue,
                    }
                }

                println!("{:?}", report);
            }

            // next loop step
            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}
