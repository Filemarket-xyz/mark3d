use web3::{
    transports::Http,
    types::{H160, U256, U64},
    signing::Key, contract::Options,
    Transport
};
use secp256k1::SecretKey;
use std::{env, str::FromStr};

pub struct OraculConf {
    pub eth_api_url: String,
    pub mark_3d_collection_contract: web3::ethabi::Contract,
    pub fraud_decider_web2_contract: web3::ethabi::Contract,
    pub fraud_decider_web2_address: String,
    pub mark_3d_access_token_contract: web3::ethabi::Contract,
    pub mark_3d_access_token_address: String,
    pub fraud_decider_web2_key: SecretKey,
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

pub async fn get_contract(env_var: &str) -> web3::ethabi::Contract {
    let abi_bytes =
        tokio::fs::read(env::var(env_var).unwrap_or_else(|_| panic!("env err ({env_var})")))
            .await
            .expect("invalid hex");

    let full_json_with_abi: serde_json::Value =
        serde_json::from_slice(&abi_bytes).expect("parse json abi failed");

    let x = serde_json::to_vec(full_json_with_abi.get("abi").expect("create abi bytes err"))
        .expect("create abi err");

    web3::ethabi::Contract::load(&*x).expect("load contract err")
}


pub async fn call_late_decision(
    transport: &web3::transports::Http,
    contract: &web3::contract::Contract<Http>,
    approved: bool,
    report: &FraudReported,
    key: &SecretKey,
) -> Result<web3::types::H256, web3::Error> {
    let params = (
        web3::ethabi::Token::Address(report.collection),
        web3::ethabi::Token::Uint(report.token_id),
        web3::ethabi::Token::Bool(approved),
    );
    let gas = match contract.estimate_gas(
        "lateDecision", 
        params,
        key.address(),
        web3::contract::Options::default())
        .await {
            Ok(g) => g,
            Err(_) => return Err(web3::Error::Internal),
        };
    let max_fee_per_gas_result = transport.execute("eth_maxPriorityFeePerGas", vec![]).await?;
    match max_fee_per_gas_result.get("error") {
        Some(value) => {
            log::error!("failed to get max priority fee per gas: {}", value.to_string());
            return Err(web3::Error::Internal)
        },
        None => (),
    };
    let max_priority_fee_per_gas: web3::types::U256 = match serde_json::from_value(max_fee_per_gas_result) {
        Ok(b) => b,
        Err(e) => {
            log::error!("failed to parse max priority fee per gas: {}", e);
            return Err(web3::Error::Internal);
        },
    };
    
    
    let opts  = Options { 
        gas: Some(gas),
        transaction_type: Some(2.into()),
        max_priority_fee_per_gas: Some(max_priority_fee_per_gas),
        ..Default::default()
     };
    contract
        .signed_call(
            "lateDecision",
            (
                web3::ethabi::Token::Address(report.collection),
                web3::ethabi::Token::Uint(report.token_id),
                web3::ethabi::Token::Bool(approved),
            ),
            opts,
            key,
        )
        .await
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to read .env file");

    let conf = OraculConf {
        eth_api_url: env::var("ETH_API_URL").expect("env err"),
        mark_3d_collection_contract: get_contract("MARK_3D_COLLECTION_PATH").await,
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
        mark_3d_access_token_contract: get_contract("MARK_3D_ACCESS_TOKEN_PATH").await,
        mark_3d_access_token_address: {
            let mut addr = env::var("MARK_3D_ACCESS_TOKEN_ADDRESS")
                .expect("env err")
                .to_lowercase();
            if !addr.starts_with("0x") {
                addr = format!("0x{}", addr);
            }
            addr
        },
        fraud_decider_web2_key: SecretKey::from_str(
            &env::var("FRAUD_DECIDER_WEB2_KEY").expect("env err"),
        )
        .expect("secret key create err"),
    };

    let transport = web3::transports::Http::new(&conf.eth_api_url).unwrap();
    let transport2 = transport.clone();
    let web3 = web3::Web3::new(transport);

    let upgraded_fraud_decider_web2_contract = web3::contract::Contract::new(
        web3.eth(),
        H160::from_str(&conf.fraud_decider_web2_address).unwrap(),
        conf.fraud_decider_web2_contract.clone(),
    );

    match call_late_decision(
        &transport2,
        &upgraded_fraud_decider_web2_contract,
        false,
        &FraudReported { 
            collection: H160::from_str("0xd15481eb070c14c86e9af168ba1e702ac257f4e6").unwrap(),
            token_id: U256::from_dec_str("0").unwrap(), 
            cid: String::from_str("ipfs://QmZ8G5ADmV81rzNZCCrx58TfMM6tJW2mmoiTw3TMGuNto8").unwrap(), 
            public_key: vec![], 
            private_key: vec![], 
            encrypted_password: vec![],  
        },
        &conf.fraud_decider_web2_key,
    )
    .await
    {
        Ok(tx) => {
            println!("lateDecision: {tx:#?}");
        }
        Err(e) => {
            println!("call lateDecision error: {e}");
        }
    }

}