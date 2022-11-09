use std::env;
use std::fs;
use aes::cipher::BlockDecrypt;
use aes::cipher::KeyInit;
use openssl::pkcs5::pbkdf2_hmac;
use openssl::hash::MessageDigest;
use hex;
use aes::Aes256;
use generic_array::GenericArray;
use sha2::{Sha256, Digest};

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let password = args[1].clone();
    let salt = "salt";
    let mut buf: Vec<u8> = vec![0; 32 as usize];
    match pbkdf2_hmac(password.as_bytes(), salt.as_bytes(), 1, MessageDigest::sha512(), &mut buf) {
        Ok(v) => println!("ok: {:?}", v),
        Err(err) => panic!("make key failed: {:?}", err),
    };
    let key_bytes = buf.clone();
    println!("{:?}", hex::encode(buf));

    let cipher = match Aes256::new_from_slice(&key_bytes) {
        Ok(c) => c,
        Err(err) => panic!("parse key failed: {:?}", err),
    };
    let contents = match fs::read(&args[2]) {
        Ok(res) => res,
        Err(err) => panic!("failed to open abi file: {:?}", err),
    };
    let mut decrypted: Vec<u8> = vec![0; contents.len()];

    for i in 0..contents.len()/16 {
        let mut block: Vec<u8> = vec![0; 16 as usize];
        block.clone_from_slice(&contents[i*16..(i+1)*16]);

        (&cipher).decrypt_block(GenericArray::from_mut_slice(block.as_mut_slice()));

        decrypted[i*16..(i+1)*16].copy_from_slice(block.as_slice());
    }

    let hash = (&decrypted[decrypted.len()-32..]).clone();
    let mut hasher = Sha256::new();
    hasher.update(&decrypted[..decrypted.len()-32]);
    let res = hasher.finalize();
    let result = res.as_slice();
    assert_eq!(hash, result);
    
    let mut ind = 0;
    for i in 0..decrypted.len() {
        if decrypted[i] == 0 {
            ind = i + 1;
        } else {
            break;
        }
    }

    fs::write(&args[3], &decrypted[ind..decrypted.len()-32]).unwrap();
}