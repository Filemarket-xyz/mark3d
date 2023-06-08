import {ethers} from "hardhat";
import { program } from "commander";
import {
  FilemarketCollectionV2__factory,
  Mark3dAccessTokenV2__factory,
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


  let accounts = await ethers.getSigners();
  const accessTokenFactory = new Mark3dAccessTokenV2__factory(accounts[0]);
  const collectionFactory = new FilemarketCollectionV2__factory(accounts[0]);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
  console.log(priorityFee)

  const collectionToClone = await collectionFactory.deploy({maxPriorityFeePerGas: priorityFee});
  console.log(collectionToClone.address)
  const accessToken = accessTokenFactory.attach(args.instance);
  console.log(accessToken.address)
  await accessToken.connect(accounts[0]).setImplementation(collectionToClone.address, {maxPriorityFeePerGas: priorityFee});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});