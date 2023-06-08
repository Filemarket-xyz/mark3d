import {ethers} from "hardhat";
import { program } from "commander";
import {
  FilemarketCollectionV2__factory,
  Mark3dAccessTokenV2__factory, PublicCollection__factory,
} from "../typechain-types";

const util = require("util")
const request = util.promisify(require("request"))

async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
  } else {
    url = 'https://filecoin-calibration.chainup.net/rpc/v1';
  }
  const options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: [],
      id: 1,
    }),
  }
  console.log(options.body);
  const res = await request(options)
  return JSON.parse(res.body).result
}

async function main() {
  program.option("-instance, --instance <string>");
  program.parse();
  const args = program.opts();

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
  let accounts = await ethers.getSigners();
  const pcFactory = new PublicCollection__factory(accounts[0]);
  const pc = pcFactory.attach("0xc8c4d9daf70fb945a1a53ac1d977303836df425e")

  console.log(0, await pc.connect(accounts[0]).royalties(0, {maxPriorityFeePerGas: priorityFee}))
  console.log(2, await pc.connect(accounts[0]).royalties(2, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(715428, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(825667, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(695804, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(40774, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(162112, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(750206, {maxPriorityFeePerGas: priorityFee}))
  console.log(await pc.connect(accounts[0]).royalties(949821, {maxPriorityFeePerGas: priorityFee}))

  // const accessTokenFactory = new Mark3dAccessTokenV2__factory(accounts[0]);
  // const collectionFactory = new FilemarketCollectionV2__factory(accounts[0]);
  //
  // console.log(priorityFee)
  //
  // const collectionToClone = await collectionFactory.deploy({maxPriorityFeePerGas: priorityFee});
  // console.log(collectionToClone.address)
  // const accessToken = accessTokenFactory.attach(args.instance);
  // console.log(accessToken.address)
  // await accessToken.connect(accounts[0]).setImplementation(collectionToClone.address, {maxPriorityFeePerGas: priorityFee});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});