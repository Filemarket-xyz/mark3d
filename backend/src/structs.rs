use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use web3::{
    ethabi::Log,
    types::{H160, U256},
};

pub struct OraculConf {
    pub eth_api_url: String,
    pub mark_3d_collection_contract: web3::ethabi::Contract,
    pub fraud_decider_web2_contract: web3::ethabi::Contract,
    pub fraud_decider_web2_address: String,
    pub mark_3d_access_token_contract: web3::ethabi::Contract,
    pub mark_3d_access_token_address: String,
    pub fraud_decider_web2_key: SecretKey,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct File {
    name: String,
    description: String,
    image: String,
    pub hidden_file: String,
}

#[derive(Debug)]
pub struct TransferFraudReported {
    pub token_id: U256,
    pub decided: bool,
    pub approved: bool,
}

impl TransferFraudReported {
    fn new() -> TransferFraudReported {
        TransferFraudReported {
            token_id: U256::default(),
            decided: false,
            approved: false,
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
                "decided" => match log.value {
                    web3::ethabi::Token::Bool(b) => e.decided = b,
                    _ => continue,
                },
                "approved" => match log.value {
                    web3::ethabi::Token::Bool(b) => e.approved = b,
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

#[derive(Debug)]
pub struct CollectionCreation {
    pub token_id: U256,
    pub instance: H160,
}

impl CollectionCreation {
    fn new() -> CollectionCreation {
        CollectionCreation {
            token_id: U256::default(),
            instance: H160::default(),
        }
    }

    pub fn from_log(logs: Log) -> CollectionCreation {
        let mut e = CollectionCreation::new();
        for log in logs.params {
            match log.name.as_str() {
                "tokenId" => match log.value {
                    web3::ethabi::Token::Uint(u) => e.token_id = u,
                    _ => continue,
                },
                "instance" => match log.value {
                    web3::ethabi::Token::Address(a) => e.instance = a,
                    _ => continue,
                },
                &_ => continue,
            }
        }
        e
    }
}
