use pgp::composed::message::Message;
use std::env;
use std::fs;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let contents = match fs::read(&args[2]) {
        Ok(res) => res,
        Err(err) => panic!("failed to open abi file: {:?}", err),
    };

    // let mut file = fs::File::create(&args[3]).unwrap();

    let password = args[1].clone();
    let m = Message::new_literal_bytes(&args[3], &contents);
    let msg = match m.decrypt_with_password(|| password) {
        Ok(m) => m,
        Err(err) => panic!("decrypt failed: {:?}", err),
    };

    for i in msg {
        println!("m: {:?}", i);
    }
}
