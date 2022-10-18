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
  const tx = await collection.connect(accounts[0]).initTransfer(hre.ethers.BigNumber.from(args.id),
    accounts[1].address, "0x", hre.ethers.constants.AddressZero);
  console.log("init transfer txid: ", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});