mod helpers;

use helpers::{
    get_block, get_contract, get_event_logs, get_latest_block_num, FraudReported, OraculConf,
    TransferFraudReported,
};
use openssl::rsa::{Padding, Rsa};
use secp256k1::SecretKey;
use std::{env, str::FromStr};
use web3::{contract::tokens::Tokenizable, types::H160};

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
        fraud_decider_web2_key: env::var("FRAUD_DECIDER_WEB2_ADDRESS").expect("env err"),
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
                ) != conf.mark_3d_collection_address
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
                    collection: H160::default(),
                    token_id: web3::types::U256::default(),
                    cid: String::new(),
                    public_key: vec![],
                    private_key: vec![],
                    encrypted_password: vec![],
                };

                for log in tx_logs.params {
                    match log.name.as_str() {
                        "collection" => match log.value {
                            web3::ethabi::Token::Address(s) => report.collection = s,
                            _ => continue,
                        },
                        "tokenId" => match log.value {
                            web3::ethabi::Token::Uint(u) => report.token_id = u,
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
                    conf.fraud_decider_web2_contract.clone(),
                );

                let key = SecretKey::from_str(&conf.fraud_decider_web2_key).unwrap();

                if report.public_key != public_key {
                    let _tx = match cont
                        .signed_call_with_confirmations(
                            "lateDecision",
                            vec![
                                report.collection.into_token(),
                                report.token_id.into_token(),
                                false.into_token(),
                            ],
                            web3::contract::Options::default(),
                            3,
                            &key,
                        )
                        .await
                    {
                        Ok(tx) => tx,
                        Err(_) => continue,
                    };
                }

                // Если есть совпадение ключей, то пытаемся расшифровать пароль.
                // Если удачно (под удачностью подразумевается, что код не свалился с ошибкой), то идем к следующему шагу.
                let mut buf: Vec<u8> = vec![0; private_key.size() as usize];

                let res_size = match private_key.private_decrypt(
                    &report.encrypted_password,
                    &mut buf,
                    Padding::PKCS1_OAEP,
                ) {
                    Ok(v) => v,
                    Err(_) => continue,
                };

                let _res = match std::str::from_utf8(&buf[..res_size]) {
                    Ok(s) => s,
                    Err(_) => continue,
                };

                // Стягивание файла из ipfs
            }

            // next loop step
            old_block_num = new_block_num;
        }

        tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
    }
}
