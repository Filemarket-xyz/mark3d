import * as openpgp from 'openpgp';
import { program } from "commander";
import fs from "fs";

async function main() {
  program.option("-pass, --pass <string>");
  program.option("-i, --i <string>");
  program.option("-o, --o <string>");
  program.parse();
  const args = program.opts();

  const toEncrypt = fs.readFileSync(args.i);
  const message = await openpgp.createMessage({
    binary: toEncrypt
  })
  const encrypted = await openpgp.encrypt({
    message: message,
    passwords: args.pass,
    format: "binary"
  })
  // @ts-ignore
  fs.writeFileSync(args.o, encrypted);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});