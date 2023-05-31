import {ethers} from "hardhat";
import {
  FilemarketCollectionV2__factory,
  FilemarketExchangeV2__factory,
  FraudDeciderWeb2V2__factory,
  Mark3dAccessTokenV2__factory,
  PublicCollection__factory
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";
const util = require("util")
const request = util.promisify(require("request"))

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

async function callRpc(method: string, params: string) {
  const network = process.env.HARDHAT_NETWORK;
  let url: string;
  if (network === 'filecoin') {
    url = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1';
  } else {
    url = 'https://api.hyperspace.node.glif.io/rpc/v1';
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
  let accounts = await ethers.getSigners();

  const accessTokenFactory = new Mark3dAccessTokenV2__factory(accounts[0]);
  const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
  const collectionFactory = new FilemarketCollectionV2__factory(accounts[0]);
  const publicCollectionFactory = new PublicCollection__factory(accounts[0]);
  const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")

  console.log(priorityFee);
  const collectionToClone = await collectionFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log("collection address: ", collectionToClone.address);
  let fraudDecider = await fraudDeciderFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log("fraud decider address: ", fraudDecider.address);
  const globalSalt = genRanHex(128);
  console.log("global salt", globalSalt);
  let accessToken = await accessTokenFactory.deploy("FileMarket Access Token", "FileMarket", "",
    "0x" + globalSalt, collectionToClone.address, true, fraudDecider.address, {
        maxPriorityFeePerGas: priorityFee,
      });
  console.log("access token address: ", accessToken.address);
  let publicCollection = await publicCollectionFactory.deploy(
      "FileMarket Public Collection",
      "FileMarketPublic",
      "",
      accounts[0].getAddress(),
      accounts[0].getAddress(),
      "0x",
      fraudDecider.address,
      true,
      {
        maxPriorityFeePerGas: priorityFee,
      });
  console.log("public collection address: ", accessToken.address);
  let exchange = await exchangeFactory.deploy({
    maxPriorityFeePerGas: priorityFee,
  });
  console.log("exchange address: ", exchange.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});