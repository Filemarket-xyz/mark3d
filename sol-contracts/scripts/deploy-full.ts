import {ethers} from "hardhat";
import {FraudDeciderWeb2__factory, Mark3dAccessToken__factory, Mark3dCollection__factory, Mark3dExchange__factory} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

async function main() {
  let accounts = await ethers.getSigners();

  const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
  const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
  const collectionFactory = new Mark3dCollection__factory(accounts[0]);
  const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

  const collectionToClone = await collectionFactory.deploy();
  let fraudDecider = await fraudDeciderFactory.deploy();
  let accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
    collectionToClone.address, true, fraudDecider.address);
  let exchange = await exchangeFactory.deploy();
  const salt = genRanHex(64);
  // await accessToken.connect(accounts[1]).createCollection("0x" + salt,
  //   "TEST", "TEST", "", "", "0x");
  // const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
  // let collectionInstance = collectionFactory.attach(collectionAddress);
  console.log("fraud decider address: ", fraudDecider.address);
  console.log("access token address: ", accessToken.address);
  console.log("exchange address: ", exchange.address);
  // console.log("collection address: ", collectionInstance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});