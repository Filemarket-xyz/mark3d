mod helpers;

use helpers::{
    get_block, get_contract, get_event_logs, get_latest_block_num, FraudReported, OraculConf,
    TransferFraudReported,
};
use openssl::rsa::{Padding, Rsa};
use std::env;
use web3::types::H160;

#[tokio::main]
async fn main() -> Result<(), web3::Error> {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: env::var("ETH_API_URL").expect("env err"),
        ihidden_files_token_upgradeable_contract: get_contract("MARK_3D_COLLECTION_PATH").await,
        ihidden_files_token_upgradeable_address: {
            let mut addr = env::var("MARK_3D_COLLECTION_ADDRESS")
                .expect("env err")
                .to_lowercase();
            if !addr.starts_with("0x") {
                addr = format!("0x{}", addr);
            }
            addr
        },
        fraud_decider_web2_contract: get_contract("FRAUD_DECIDER_WEB2_PATH").await,
        fraud_decider_web2_address: {
            let mut addr = env::var("FRAUD_DECIDER_WEB2_ADDRESS")
                .expect("env err")
                .to_lowercase();
            if !addr.starts_with("0x") {
                addr = format!("0x{}", addr);
            }
            addr
        },
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
                ) != conf.ihidden_files_token_upgradeable_address
                {
                    continue;
                }

                // try fetch TransferFraudReported event from Mark3dCollection contract
                let tx_logs = match get_event_logs(
                    "TransferFraudReported",
                    tx.hash,
                    &web3,
                    &conf.ihidden_files_token_upgradeable_contract,
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

                let private_key = match Rsa::private_key_from_pem(&report.private_key) {
                    Ok(key) => key,
                    Err(_) => continue,
                };

                let public_key = match private_key.public_key_to_pem() {
                    Ok(key) => key,
                    Err(_) => continue,
                };

                let cont = web3::contract::Contract::new(
                    web3.eth(),
                    H160::from_slice(conf.fraud_decider_web2_address.as_bytes()),
                    conf.fraud_decider_web2_contract,
                );

                if report.public_key != public_key {
                    // нужно вызывать lateDecision у FraudDeciderWeb2 с аргументом
                    // approve выставленным в false (tokenInstance это collection
                    // из эвента FraudReported, tokenId это tokenId из эвента FraudReported).
                    let tx = match cont
                        .call_with_confirmations(
                            "lateDecision",
                            params,
                            from,
                            options,
                            confirmations,
                        )
                        .await
                    {
                        Ok(tx) => tx,
                        Err(_) => continue,
                    };
                }

                // Если есть совпадение ключей, то пытаемся расшифровать пароль.
                // Если удачно (под удачностью подразумевается, что код не свалился с ошибкой), то идем к следующему шагу.
            }

            // next loop step
            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}
