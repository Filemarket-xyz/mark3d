import NodeRsa from "node-rsa";
import { program } from "commander";

async function main() {
  program.option("-pass, --pass <string>");
  program.option("-key, --key <string>");
  program.parse();
  const args = program.opts();

  const key = Buffer.from(args.key.substring(2), "hex");
  const privateKey = new NodeRsa(key);
  const decrypted = privateKey.decrypt(Buffer.from(args.pass.substring(2), "hex"));
  console.log(decrypted.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});