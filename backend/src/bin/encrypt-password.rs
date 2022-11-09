use std::str;
use std::env;
use openssl::rsa::{Rsa, Padding};
// use rand;
#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let key_bytes = match hex::decode(args[1].as_bytes()) {
        Ok(h) => h,
        Err(err) => panic!("hex decode failed: {:?}", err),
    };

    let key_str = match str::from_utf8(&key_bytes) {
        Ok(s) => s,
        Err(err) => panic!("rsa key bytes to string failed: {:?}", err),
    };

    println!("{:?}", key_str);

    let public_key = match Rsa::public_key_from_pem(&key_bytes) {
        Ok(key) => key,
        Err(err) => panic!("parse rsa public key failed: {:?}", err),
    };

    println!("{:?}", public_key);

    let mut buf: Vec<u8> = vec![0; public_key.size() as usize];
    match public_key.public_encrypt(args[2].as_bytes(), &mut buf, Padding::PKCS1_OAEP) {
        Ok(v) => println!("encryption successful: {:?}", v),
        Err(err) => panic!("encrypt failed: {:?}", err),
    };

    println!("{:?}", hex::encode(buf));
}