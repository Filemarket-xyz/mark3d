use openssl::rsa::{Padding, Rsa};
use std::env;
use std::str;

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

    let private_key = match Rsa::private_key_from_pem(&key_bytes) {
        Ok(key) => key,
        Err(err) => panic!("parse rsa private key failed: {:?}", err),
    };

    let data = match hex::decode(args[2].as_bytes()) {
        Ok(h) => h,
        Err(err) => panic!("hex decode failed: {:?}", err),
    };

    let mut buf: Vec<u8> = vec![0; private_key.size() as usize];

    let res_size = match private_key.private_decrypt(&data, &mut buf, Padding::PKCS1_OAEP) {
        Ok(v) => v,
        Err(err) => panic!("encrypt failed: {:?}", err),
    };

    let res = match str::from_utf8(&buf[..res_size]) {
        Ok(s) => s,
        Err(err) => panic!("res to string failed: {:?}", err),
    };
    println!("res: {:?}", res);
}
