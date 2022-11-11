mod helpers;

use aes::cipher::BlockDecrypt;
use aes::cipher::KeyInit;
use aes::Aes256;
use generic_array::GenericArray;
use helpers::call_late_decision;
use helpers::{
    get_block, get_contract, get_event_logs, get_latest_block_num, File, FraudReported, OraculConf,
    TransferFraudReported,
};
use openssl::{
    hash::MessageDigest,
    pkcs5::pbkdf2_hmac,
    rsa::{Padding, Rsa},
};
use secp256k1::SecretKey;
use sha2::Digest;
use sha2::Sha256;
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
                    tokio::time::sleep(tokio::time::Duration::from_millis(200)).await;
                    continue;
                } else {
                    n
                }
            }
            Err(e) => {
                println!("{}", e);
                continue;
            }
        };

        // blocks enumeration (from old to latest)
        for i in old_block_num + 1..=new_block_num {
            let block = match get_block(i, &web3).await {
                Ok(b) => b,
                Err(e) => {
                    println!("{}", e);
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
                    Err(e) => {
                        println!("{}", e);
                        continue;
                    }
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
                    Err(e) => {
                        println!("{}", e);
                        continue;
                    }
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
                                println!("{:#?}", tx);
                                continue;
                            }
                            Err(e) => {
                                println!("{}", e);
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
                            println!("{:#?}", tx);
                            continue;
                        }
                        Err(e) => {
                            println!("{}", e);
                            continue;
                        }
                    }
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

                let decrypted_password = match std::str::from_utf8(&buf[..res_size]) {
                    Ok(s) => s,
                    Err(_) => continue,
                };

                // Стягивание файла из ipfs
                let link = if report.cid.starts_with("ipfs://") {
                    format!(
                        "https://nftstorage.link/ipfs/{}",
                        report.cid.replace("ipfs://", "")
                    )
                } else {
                    println!("invalid cid");
                    continue;
                };

                let file: File = match reqwest::Client::new().get(link).send().await {
                    Ok(r) => match r.json().await {
                        Ok(f) => f,
                        Err(e) => {
                            println!("{}", e);
                            continue;
                        }
                    },
                    Err(e) => {
                        println!("{}", e);
                        continue;
                    }
                };

                let hidden_file_link = if file.hidden_file.starts_with("ipfs://") {
                    format!(
                        "https://nftstorage.link/ipfs/{}",
                        report.cid.replace("ipfs://", "")
                    )
                } else {
                    println!("invalid hidden file link");
                    continue;
                };

                let hidden_file: Vec<u8> =
                    match reqwest::Client::new().get(hidden_file_link).send().await {
                        Ok(r) => match r.bytes().await {
                            Ok(b) => b.to_vec(),
                            Err(e) => {
                                println!("{}", e);
                                continue;
                            }
                        },
                        Err(e) => {
                            println!("{}", e);
                            continue;
                        }
                    };

                // Расшифровать файл с помощью пароля
                // need: hidden file, decrypted password
                let salt = "salt";
                let mut buf: Vec<u8> = vec![0; 32];
                if let Err(e) = pbkdf2_hmac(
                    decrypted_password.as_bytes(),
                    salt.as_bytes(),
                    1,
                    MessageDigest::sha512(),
                    &mut buf,
                ) {
                    println!("make key failed: {:?}", e);
                    match call_late_decision(
                        &upgraded_fraud_decider_web2_contract,
                        true,
                        &report,
                        &conf.fraud_decider_web2_key,
                    )
                    .await
                    {
                        Ok(tx) => {
                            println!("{:#?}", tx);
                            continue;
                        }
                        Err(e) => {
                            println!("{}", e);
                            continue;
                        }
                    }
                };
                let key_bytes = buf.clone();

                let cipher = match Aes256::new_from_slice(&key_bytes) {
                    Ok(c) => c,
                    Err(e) => {
                        println!("parse key failed: {:?}", e);
                        match call_late_decision(
                            &upgraded_fraud_decider_web2_contract,
                            true,
                            &report,
                            &conf.fraud_decider_web2_key,
                        )
                        .await
                        {
                            Ok(tx) => {
                                println!("{:#?}", tx);
                                continue;
                            }
                            Err(e) => {
                                println!("{}", e);
                                continue;
                            }
                        }
                    }
                };
                let mut decrypted: Vec<u8> = vec![0; hidden_file.len()];

                for i in 0..hidden_file.len() / 16 {
                    let mut block: Vec<u8> = vec![0; 16];
                    block.clone_from_slice(&hidden_file[i * 16..(i + 1) * 16]);

                    cipher.decrypt_block(GenericArray::from_mut_slice(block.as_mut_slice()));

                    decrypted[i * 16..(i + 1) * 16].copy_from_slice(block.as_slice());
                }

                let hash = &decrypted[decrypted.len() - 32..];
                let mut hasher = Sha256::new();
                hasher.update(&decrypted[..decrypted.len() - 32]);
                let res = hasher.finalize();
                let result = res.as_slice();
                match call_late_decision(
                    &upgraded_fraud_decider_web2_contract,
                    result != hash,
                    &report,
                    &conf.fraud_decider_web2_key,
                )
                .await
                {
                    Ok(tx) => {
                        println!("{:#?}", tx);
                        continue;
                    }
                    Err(e) => {
                        println!("{}", e);
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
