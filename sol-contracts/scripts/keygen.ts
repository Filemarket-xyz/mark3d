import NodeRsa from "node-rsa";
import * as hre from "hardhat";

async function main() {
  const key = new NodeRsa({b: 512}).generateKeyPair(512);
  const privateKey = key.exportKey('private');
  const publicKey = key.exportKey('public');
  console.log(hre.ethers.utils.hexlify(Buffer.from(privateKey)));
  console.log(hre.ethers.utils.hexlify(Buffer.from(publicKey)));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});