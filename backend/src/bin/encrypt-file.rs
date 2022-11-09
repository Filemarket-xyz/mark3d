use pgp::composed::message::Message;
use pgp::crypto::sym::SymmetricKeyAlgorithm;
use pgp::types::StringToKey;
use std::env;
use std::fs;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let contents = match fs::read(&args[2]) {
        Ok(res) => res,
        Err(err) => panic!("failed to open abi file: {:?}", err),
    };

    let mut file = fs::File::create(&args[3]).unwrap();

    let mut rng = rand::thread_rng();
    let mut rng2 = rand::thread_rng();
    let password = args[1].clone();
    let msg = match Message::new_literal_bytes(&args[3], &contents).encrypt_with_password(
        &mut rng,
        StringToKey::new_default(&mut rng2),
        SymmetricKeyAlgorithm::AES256,
        || password,
    ) {
        Ok(m) => m,
        Err(err) => panic!("message encrypt failed: {:?}", err),
    };
    match msg.to_armored_writer(&mut file, None) {
        Ok(v) => println!("finished: {:?}", v),
        Err(err) => panic!("write message failed: {:?}", err),
    };
}
