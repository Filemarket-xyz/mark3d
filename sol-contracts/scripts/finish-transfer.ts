import * as hre from "hardhat";
import { program } from "commander";
import {Mark3dCollection__factory} from "../typechain-types";

async function main() {
  program.option("-id, --id <string>");
  program.option("-collection, --collection <string>");
  program.parse();
  const args = program.opts();

  let accounts = await hre.ethers.getSigners();
  const collectionFactory = new Mark3dCollection__factory(accounts[0]);
  const collection = collectionFactory.attach(args.collection);
  const tx = await collection.connect(accounts[1]).finalizeTransfer(hre.ethers.BigNumber.from(args.id));
  console.log("finish transfer txid: ", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});