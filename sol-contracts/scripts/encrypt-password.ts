import NodeRsa from "node-rsa";
import { program } from "commander";
import * as hre from "hardhat";

async function main() {
  program.option("-pass, --pass <string>");
  program.option("-key, --key <string>");
  program.parse();
  const args = program.opts();

  const key = Buffer.from(args.key.substring(2), "hex");
  const publicKey = new NodeRsa(key);
  const encrypted = publicKey.encrypt(args.pass);
  console.log(hre.ethers.utils.hexlify(encrypted));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});