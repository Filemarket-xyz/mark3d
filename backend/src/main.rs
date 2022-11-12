mod helpers;

use helpers::call_late_decision;
use helpers::decrypt_file;
use helpers::decrypt_password;
use helpers::fetch_file;
use helpers::{get_block, get_contract, get_events, get_latest_block_num, OraculConf};
use openssl::rsa::Rsa;
use secp256k1::SecretKey;
use std::{env, str::FromStr};
use web3::types::H160;

#[tokio::main]
async fn main() -> Result<(), web3::Error> {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: env::var("ETH_API_URL").expect("env err"),
        mark_3d_collection_contract: get_contract("MARK_3D_COLLECTION_PATH").await,
        mark_3d_collection_address: {
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
        fraud_decider_web2_key: SecretKey::from_str(
            &env::var("FRAUD_DECIDER_WEB2_ADDRESS").expect("env err"),
        )
        .expect("secret key create err"),
    };

    let web3 = web3::Web3::new(web3::transports::WebSocket::new(&conf.eth_api_url).await?);
    let mut old_block_num: u64 = match get_latest_block_num(&web3).await {
        Ok(n) => n,
        Err(e) => panic!("{}", e),
    };

    let upgraded_fraud_decider_web2_contract = web3::contract::Contract::new(
        web3.eth(),
        H160::from_slice(conf.fraud_decider_web2_address.as_bytes()),
        conf.fraud_decider_web2_contract.clone(),
    );

    // TransferFraudReported listening
    loop {
        // get latest block
        let new_block_num: u64 = match get_latest_block_num(&web3).await {
            Ok(n) => {
                if n == old_block_num {
                    continue;
                } else {
                    n
                }
            }
            Err(e) => {
                println!("get latest block num error: {e}");
                continue;
            }
        };

        // blocks enumeration (from old to latest)
        for i in old_block_num + 1..=new_block_num {
            let block = match get_block(i, &web3).await {
                Ok(b) => b,
                Err(e) => {
                    println!("get block error: {e}");
                    continue;
                }
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
                ) != conf.mark_3d_collection_address
                {
                    continue;
                }

                let (_report_flag, report) =
                    match get_events(tx.hash, &web3, &conf.mark_3d_collection_contract).await {
                        Ok(events) => events,
                        Err(e) => {
                            println!("get event logs error: {e}");
                            continue;
                        }
                    };

                let private_key = match Rsa::private_key_from_pem(&report.private_key) {
                    Ok(k) => k,
                    Err(_) => {
                        match call_late_decision(
                            &upgraded_fraud_decider_web2_contract,
                            false,
                            &report,
                            &conf.fraud_decider_web2_key,
                        )
                        .await
                        {
                            Ok(tx) => {
                                println!("{tx:#?}");
                                continue;
                            }
                            Err(e) => {
                                println!("call lateDecision error: {e}");
                                continue;
                            }
                        }
                    }
                };

                let public_key = match private_key.public_key_to_pem() {
                    Ok(key) => key,
                    Err(_) => continue,
                };

                if report.public_key != public_key {
                    match call_late_decision(
                        &upgraded_fraud_decider_web2_contract,
                        false,
                        &report,
                        &conf.fraud_decider_web2_key,
                    )
                    .await
                    {
                        Ok(tx) => {
                            println!("{tx:#?}");
                            continue;
                        }
                        Err(e) => {
                            println!("call lateDecision error: {e}");
                            continue;
                        }
                    }
                }

                // Если есть совпадение ключей, то пытаемся расшифровать пароль.
                // Если удачно (под удачностью подразумевается, что код не свалился с ошибкой), то идем к следующему шагу.
                let decrypted_password = match decrypt_password(private_key, &report).await {
                    Ok(p) => p,
                    Err(_) => {
                        match call_late_decision(
                            &upgraded_fraud_decider_web2_contract,
                            true,
                            &report,
                            &conf.fraud_decider_web2_key,
                        )
                        .await
                        {
                            Ok(tx) => {
                                println!("{tx:#?}");
                                continue;
                            }
                            Err(e) => {
                                println!("call lateDecision error: {e}");
                                continue;
                            }
                        }
                    }
                };

                // Стягивание файла из ipfs
                let hidden_file: Vec<u8> = match fetch_file(&report).await {
                    Ok(f) => f,
                    Err(_) => {
                        match call_late_decision(
                            &upgraded_fraud_decider_web2_contract,
                            true,
                            &report,
                            &conf.fraud_decider_web2_key,
                        )
                        .await
                        {
                            Ok(tx) => {
                                println!("{tx:#?}");
                                continue;
                            }
                            Err(e) => {
                                println!("call lateDecision error: {e}");
                                continue;
                            }
                        }
                    }
                };

                // Расшифровать файл с помощью пароля
                // need: hidden file, decrypted password
                match call_late_decision(
                    &upgraded_fraud_decider_web2_contract,
                    match decrypt_file(hidden_file, &decrypted_password).await {
                        Ok(res) => res,
                        Err(_) => {
                            match call_late_decision(
                                &upgraded_fraud_decider_web2_contract,
                                true,
                                &report,
                                &conf.fraud_decider_web2_key,
                            )
                            .await
                            {
                                Ok(tx) => {
                                    println!("{tx:#?}");
                                    continue;
                                }
                                Err(e) => {
                                    println!("call lateDecision error: {e}");
                                    continue;
                                }
                            }
                        }
                    },
                    &report,
                    &conf.fraud_decider_web2_key,
                )
                .await
                {
                    Ok(tx) => {
                        println!("lateDecision: {tx:#?}");
                        continue;
                    }
                    Err(e) => {
                        println!("call lateDecision error: {e}");
                        continue;
                    }
                }
            }

            // prepare next loop step
            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}
