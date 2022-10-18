import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber as BN, Signer} from "ethers";
import {
  FraudDeciderWeb2,
  FraudDeciderWeb2__factory,
  Mark3dAccessToken,
  Mark3dAccessToken__factory,
  Mark3dCollection,
  Mark3dCollection__factory
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

describe("Success transfer", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();
    accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
      collectionToClone.address, true, fraudDecider.address);
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
  });

  it("init transfer", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .initTransfer(BN.from(0),
      accounts[2].getAddress(), "0x", ethers.constants.AddressZero);
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferInit")
      .withArgs(BN.from(0), await accounts[1].getAddress(), await accounts[2].getAddress());
  });

  it("set public key", async () => {
    const tx = await collectionInstance.connect(accounts[2])
      .setTransferPublicKey(BN.from(0), "0x12");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPublicKeySet")
      .withArgs(BN.from(0), "0x12");
  });

  it("set encrypted password", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .approveTransfer(BN.from(0), "0x34");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPasswordSet")
      .withArgs(BN.from(0), "0x34");
  });

  it("finalize transfer", async() => {
    const tx = await collectionInstance.connect(accounts[2])
      .finalizeTransfer(BN.from(0));
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFinished")
      .withArgs(BN.from(0));
    await expect(tx)
      .to
      .emit(collectionInstance, "Transfer")
      .withArgs(await accounts[1].getAddress(), await accounts[2].getAddress(), BN.from(0));
  });
});

describe("Transfer with fraud", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();
    accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
      collectionToClone.address, true, fraudDecider.address);
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "b", "0x");
  });

  it("init transfer", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .initTransfer(BN.from(0),
        accounts[2].getAddress(), "0x", ethers.constants.AddressZero);
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferInit")
      .withArgs(BN.from(0), await accounts[1].getAddress(), await accounts[2].getAddress());
  });

  it("set public key", async () => {
    const tx = await collectionInstance.connect(accounts[2])
      .setTransferPublicKey(BN.from(0), "0x1234");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPublicKeySet")
      .withArgs(BN.from(0), "0x1234");
  });

  it("set encrypted password", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .approveTransfer(BN.from(0), "0x3421");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPasswordSet")
      .withArgs(BN.from(0), "0x3421");
  });

  it("report fraud", async () => {
    const tx = await collectionInstance.connect(accounts[2])
      .reportFraud(BN.from(0), "0x12");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudReported")
      .withArgs(BN.from(0), false, false);
  });

  it("fraud approved", async () => {
    const tx = await fraudDecider.connect(accounts[0])
      .lateDecision(collectionInstance.address, BN.from(0), false);
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudReported")
      .withArgs(BN.from(0), true, false);
    await expect(tx)
      .to
      .emit(collectionInstance, "Transfer")
      .withArgs(await accounts[1].getAddress(), await accounts[2].getAddress(), BN.from(0));
  });
});