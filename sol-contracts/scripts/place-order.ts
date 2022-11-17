import * as hre from "hardhat";
import { program } from "commander";
import {Mark3dExchange__factory} from "../typechain-types";

async function main() {
  program.option("-id, --id <string>");
  program.option("-collection, --collection <string>");
  program.option("-exchange, --exchange <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();
  const factory = new Mark3dExchange__factory(accounts[0]);
  const exchange = factory.attach(args.exchange);
  const tx = await exchange.connect(accounts[1]).placeOrder(args.collection, args.id, 10000);
  console.log("place order txid: ", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});