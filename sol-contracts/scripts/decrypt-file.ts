import * as openpgp from 'openpgp';
import { program } from "commander";
import fs from "fs";

async function main() {
  program.option("-pass, --pass <string>");
  program.option("-i, --i <string>");
  program.option("-o, --o <string>");
  program.parse();
  const args = program.opts();

  const toDecrypt = fs.readFileSync(args.i);
  const encryptedMessage = await openpgp.readMessage({
    binaryMessage: toDecrypt
  });
  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    passwords: args.pass,
    format: 'binary'
  });
  // @ts-ignore
  fs.writeFileSync(args.o, decrypted);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});