import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber as BN, Signer} from "ethers";
import {
  FraudDeciderWeb2,
  FraudDeciderWeb2__factory,
  Mark3dAccessToken,
  Mark3dAccessToken__factory,
  Mark3dCollection,
  Mark3dCollection__factory,
  Mark3dExchange, Mark3dExchange__factory
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

describe("Trade token", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;
  let exchangeInstance: Mark3dExchange

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);
    const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();
    accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
      collectionToClone.address, true, fraudDecider.address);
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
    exchangeInstance = await exchangeFactory.deploy();
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
  });

  it("approve", async () => {
    await collectionInstance.connect(accounts[1]).setApprovalForAll(exchangeInstance.address, true);
  });

  it("create order", async () => {
    await exchangeInstance.connect(accounts[1]).placeOrder(collectionInstance.address, BN.from(0), BN.from(10000));
  });

  it("fulfill order", async () => {
    const tx = await exchangeInstance.connect(accounts[2])
      .fulfillOrder(collectionInstance.address, "0xa1", BN.from(0), {
        value: BN.from(10000)
      });
    await expect(tx)
        .to
        .emit(collectionInstance, "TransferDraftCompletion")
        .withArgs(BN.from(0), await accounts[2].getAddress())
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
    await expect(tx)
      .to
      .changeEtherBalance(accounts[1], BN.from(10000));
  });
});

describe("Trade token with fraud not approved", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;
  let exchangeInstance: Mark3dExchange

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);
    const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();
    accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
      collectionToClone.address, true, fraudDecider.address);
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
    exchangeInstance = await exchangeFactory.deploy();
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
  });

  it("approve", async () => {
    await collectionInstance.connect(accounts[1]).setApprovalForAll(exchangeInstance.address, true);
  });

  it("create order", async () => {
    await exchangeInstance.connect(accounts[1]).placeOrder(collectionInstance.address, BN.from(0), BN.from(10000));
  });

  it("fulfill order", async () => {
    await exchangeInstance.connect(accounts[2])
      .fulfillOrder(collectionInstance.address, "0xa1", BN.from(0), {
        value: BN.from(10000)
      })
  });

  it("set encrypted password", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .approveTransfer(BN.from(0), "0x34");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPasswordSet")
      .withArgs(BN.from(0), "0x34");
  });

  it("report fraud", async () => {
    const tx = await collectionInstance.connect(accounts[2])
      .reportFraud(BN.from(0), "0x12");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudReported")
      .withArgs(BN.from(0));
  });

  it("fraud approved", async () => {
    const tx = await fraudDecider.connect(accounts[0])
      .lateDecision(collectionInstance.address, BN.from(0), false);
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudDecided")
      .withArgs(BN.from(0), false);
    await expect(tx)
      .to
      .emit(collectionInstance, "Transfer")
      .withArgs(await accounts[1].getAddress(), await accounts[2].getAddress(), BN.from(0));
    await expect(tx)
      .to
      .changeEtherBalance(accounts[1], BN.from(10000));
  });
});

describe("Trade token with fraud approved", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;
  let exchangeInstance: Mark3dExchange

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);
    const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();
    accessToken = await accessTokenFactory.deploy("Mark3D Access Token", "MARK3D", "",
      collectionToClone.address, true, fraudDecider.address);
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
    exchangeInstance = await exchangeFactory.deploy();
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
  });

  it("approve", async () => {
    await collectionInstance.connect(accounts[1]).setApprovalForAll(exchangeInstance.address, true);
  });

  it("create order", async () => {
    await exchangeInstance.connect(accounts[1]).placeOrder(collectionInstance.address, BN.from(0), BN.from(10000));
  });

  it("fulfill order", async () => {
    await exchangeInstance.connect(accounts[2])
      .fulfillOrder(collectionInstance.address, "0xa1", BN.from(0), {
        value: BN.from(10000)
      })
  });

  it("set encrypted password", async () => {
    const tx = await collectionInstance.connect(accounts[1])
      .approveTransfer(BN.from(0), "0x34");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferPasswordSet")
      .withArgs(BN.from(0), "0x34");
  });

  it("report fraud", async () => {
    const tx = await collectionInstance.connect(accounts[2])
      .reportFraud(BN.from(0), "0x12");
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudReported")
      .withArgs(BN.from(0));
  });

  it("fraud approved", async () => {
    const tx = await fraudDecider.connect(accounts[0])
      .lateDecision(collectionInstance.address, BN.from(0), true);
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferFraudDecided")
      .withArgs(BN.from(0), true);
    await expect(tx)
      .to
      .changeEtherBalance(accounts[2], BN.from(10000));
  });
});