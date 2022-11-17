import * as hre from "hardhat";
import { program } from "commander";
import {Mark3dExchange__factory} from "../typechain-types";

async function main() {
  program.option("-id, --id <string>");
  program.option("-collection, --collection <string>");
  program.option("-exchange, --exchange <string>");
  program.option("-key, --key <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();
  const factory = new Mark3dExchange__factory(accounts[0]);
  const exchange = factory.attach(args.exchange);
  const tx = await exchange.connect(accounts[2]).fulfillOrder(args.collection, args.key, args.id, {
    value: 10000,
  });
  console.log("fulfill order txid: ", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});