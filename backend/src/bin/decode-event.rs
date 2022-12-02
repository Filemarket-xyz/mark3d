use std::{env, fs};
use web3::{
    ethabi::{Contract, Log, RawLog},
    transports::Http,
    types::{Block, BlockId, BlockNumber, Transaction, TransactionReceipt, H256},
    Web3,
    signing::Key, contract::Options,
    types::{H160, U256},
};
use openssl::rsa::Rsa;
use openssl::{
    hash::MessageDigest,
    pkcs5::pbkdf2_hmac,
    pkey::Private,
    rsa::{Padding},
};

#[derive(Debug)]
pub struct TransferFraudReported {
    pub token_id: U256,
}

impl TransferFraudReported {
    fn new() -> TransferFraudReported {
        TransferFraudReported {
            token_id: U256::default(),
        }
    }

    pub fn from_log(logs: Log) -> TransferFraudReported {
        let mut e = TransferFraudReported::new();
        for log in logs.params {
            match log.name.as_str() {
                "tokenId" => match log.value {
                    web3::ethabi::Token::Uint(u) => e.token_id = u,
                    _ => continue,
                },
                &_ => continue,
            }
        }
        e
    }
}

#[derive(Debug)]
pub struct FraudReported {
    pub collection: H160,
    pub token_id: U256,
    pub cid: String,
    pub public_key: Vec<u8>,
    pub private_key: Vec<u8>,
    pub encrypted_password: Vec<u8>,
}

impl FraudReported {
    fn new() -> FraudReported {
        FraudReported {
            collection: H160::default(),
            token_id: U256::default(),
            cid: String::new(),
            public_key: vec![],
            private_key: vec![],
            encrypted_password: vec![],
        }
    }

    pub fn from_log(logs: Log) -> FraudReported {
        let mut e = FraudReported::new();
        for log in logs.params {
            match log.name.as_str() {
                "collection" => match log.value {
                    web3::ethabi::Token::Address(s) => e.collection = s,
                    _ => continue,
                },
                "tokenId" => match log.value {
                    web3::ethabi::Token::Uint(u) => e.token_id = u,
                    _ => continue,
                },
                "cid" => match log.value {
                    web3::ethabi::Token::String(s) => e.cid = s,
                    _ => continue,
                },
                "publicKey" => match log.value {
                    web3::ethabi::Token::Bytes(b) => e.public_key = b,
                    _ => continue,
                },
                "privateKey" => match log.value {
                    web3::ethabi::Token::Bytes(b) => e.private_key = b,
                    _ => continue,
                },
                "encryptedPassword" => match log.value {
                    web3::ethabi::Token::Bytes(b) => e.encrypted_password = b,
                    _ => continue,
                },
                &_ => continue,
            }
        }
        e
    }
}

async fn get_tx_receipt(
    hash: H256,
    web3: &Web3<Http>,
) -> Result<TransactionReceipt, web3::Error> {
    if let Some(tx) = match web3.eth().transaction_receipt(hash).await {
        Ok(tx) => tx,
        Err(e) => return Err(e),
    } {
        Ok(tx)
    } else {
        Err(web3::Error::Internal)
    }
}

pub async fn get_events(
    hash: H256,
    web3: &Web3<Http>,
    collection: &Contract,
    fraud_decider: &Contract,
) -> Result<(TransferFraudReported, FraudReported), web3::Error> {
    let tx = get_tx_receipt(hash, web3).await?;
    if tx.logs.len() < 2 {
        return Err(web3::Error::Internal);
    }

    let event_t_f_r = match collection.event("TransferFraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };
    let event_f_r = match fraud_decider.event("FraudReported") {
        Ok(e) => e,
        Err(e) => return Err(web3::Error::Decoder(format!("{}", e))),
    };

    let mut t_f_r_log: Log = Log { params: vec![] };
    let mut f_r_log: Log = Log { params: vec![] };
    let mut left_events: i32 = 2;
    for i in 0..tx.logs.len() {
        if let Ok(log) = event_t_f_r.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            left_events-=1;
            t_f_r_log = log;
        }

        if let Ok(log) = event_f_r.parse_log(RawLog {
            topics: tx.logs[i]
                .topics
                .iter()
                .map(|x| H256::from_slice(x.as_bytes()))
                .collect(),
            data: Vec::from(tx.logs[i].data.0.as_slice()),
        }) {
            left_events-=1;
            f_r_log = log;
        }
    }
    if left_events != 0 {
        return Err(web3::Error::Decoder(format!("events not found")));
    }

    Ok((
        TransferFraudReported::from_log(t_f_r_log),
        FraudReported::from_log(f_r_log),
    ))
}

pub async fn get_contract(path: &str) -> web3::ethabi::Contract {
    let abi_bytes =
        tokio::fs::read(path)
            .await
            .expect("invalid hex");

    let full_json_with_abi: serde_json::Value =
        serde_json::from_slice(&abi_bytes).expect("parse json abi failed");

    let x = serde_json::to_vec(full_json_with_abi.get("abi").expect("create abi bytes err"))
        .expect("create abi err");

    web3::ethabi::Contract::load(&*x).expect("load contract err")
}

pub fn decrypt_password(
    private_key: &Rsa<Private>,
    report: &FraudReported,
) -> Result<String, web3::Error> {
    let mut buf: Vec<u8> = vec![0; private_key.size() as usize];

    let res_size = match private_key.private_decrypt(
        &report.encrypted_password,
        &mut buf,
        Padding::NONE,
    ) {
        Ok(v) => v,
        Err(e) => return Err(web3::Error::Decoder(format!("{e}"))),
    };
    println!("well well");

    match std::str::from_utf8(&buf[..res_size]) {
        Ok(s) => Ok(s.to_string()),
        Err(e) => Err(web3::Error::Decoder(format!("{e}"))),
    }
}

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let transport = match web3::transports::Http::new(&args[1]) {
        Ok(t) => t,
        Err(err) => panic!("create transport failed: {:?}", err),
    };
    let web3 = web3::Web3::new(transport);
    let hash_bytes = match hex::decode(args[2].as_bytes()) {
        Ok(h) => H256::from_slice(&h),
        Err(err) => panic!("hex decode failed: {:?}", err),
    };
    let tx = match web3.eth().transaction_receipt(hash_bytes).await {
        Ok(tx) => tx,
        Err(err) => panic!("get transaction failed: {:?}", err),
    };
    let tx = match tx {
        Some(t) => t,
        None => panic!("transaction not found"),
    };

    let contract = get_contract(&args[3]).await;
    let contract2 = get_contract(&args[4]).await;

    let (_report_flag, report) = match get_events(
                        tx.transaction_hash,
                        &web3,
                        &contract,
                        &contract2).await {
                        Ok(events) => events,
                        Err(e) => {
                            panic!("parse events failed: {e}");
                        }
    };
    println!("fraud events: {:?} {:?}", _report_flag, report);
    let private_key = match Rsa::private_key_from_pem(&report.private_key) {
                    Ok(k) => k,
                    Err(_) => {
                        panic!("not approved, because invalid private key");
                    }
    };

    let mut public_key = match private_key.public_key_to_pem() {
        Ok(key) => key,
        Err(_) => panic!("to pub key failed"),
    };

    println!("{:}", String::from_utf8(public_key).unwrap().replace("\n", ""));
    println!("{:}", String::from_utf8(report.public_key.clone()).unwrap().replace("\n", ""));

    let decrypted_password = match decrypt_password(&private_key, &report) {
        Ok(p) => p,
        Err(_e) => {
            panic!("approved, because passwor decryption failed {:?}", _e);
        }
    };
}