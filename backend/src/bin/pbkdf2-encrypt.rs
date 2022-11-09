use aes::cipher::BlockEncrypt;
use aes::cipher::KeyInit;
use aes::Aes256;
use generic_array::GenericArray;
use openssl::hash::MessageDigest;
use openssl::pkcs5::pbkdf2_hmac;
use sha2::{Digest, Sha256};
use std::env;
use std::fs;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let password = args[1].clone();
    let salt = "salt";
    let mut buf: Vec<u8> = vec![0; 32];
    match pbkdf2_hmac(
        password.as_bytes(),
        salt.as_bytes(),
        1,
        MessageDigest::sha512(),
        &mut buf,
    ) {
        Ok(v) => println!("ok: {:?}", v),
        Err(err) => panic!("make key failed: {:?}", err),
    };
    let key_bytes = buf.clone();
    println!("{:?}", hex::encode(buf));

    let cipher = match Aes256::new_from_slice(&key_bytes) {
        Ok(c) => c,
        Err(err) => panic!("parse key failed: {:?}", err),
    };
    let mut contents = match fs::read(&args[2]) {
        Ok(res) => res,
        Err(err) => panic!("failed to open abi file: {:?}", err),
    };
    let mut padded: Vec<u8> =
        vec![0; if contents.len() % 16 == 0 { 0 } else { 16 } - (contents.len() % 16)];
    padded.append(&mut contents);
    let mut hasher = Sha256::new();
    hasher.update(padded.clone());
    let mut res = hasher.finalize();
    let result = res.as_mut_slice();
    let res_vec = result.to_vec();
    padded.append(res_vec.to_vec().as_mut());

    let mut encrypted: Vec<u8> = vec![0; padded.len()];

    for i in 0..padded.len() / 16 {
        let mut block: Vec<u8> = vec![0; 16];
        block.clone_from_slice(&padded[i * 16..(i + 1) * 16]);

        cipher.encrypt_block(GenericArray::from_mut_slice(block.as_mut_slice()));

        encrypted[i * 16..(i + 1) * 16].copy_from_slice(block.as_slice());
    }

    fs::write(&args[3], encrypted).unwrap();
}
