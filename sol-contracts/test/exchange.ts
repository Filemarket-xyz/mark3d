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
  Mark3dExchange,
  Mark3dExchange__factory
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

    const encoder = new TextEncoder();
    const globalSalt = ethers.utils.hexlify(encoder.encode("Global Salt"));

    accessToken = await accessTokenFactory.deploy(
      "Mark3D Access Token",
      "MARK3D",
      "",
      globalSalt,
      collectionToClone.address,
      true,
      fraudDecider.address
    );
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

  it("finalize transfer", async () => {
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

describe("Trade token with whitelist", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;
  let exchangeInstance: Mark3dExchange;
  let start: number;

  before(async () => {
    start = Math.round(Date.now() / 1000) + 10000;
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);
    const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();

    const encoder = new TextEncoder();
    const globalSalt = ethers.utils.hexlify(encoder.encode("Global Salt"));

    accessToken = await accessTokenFactory.deploy(
      "Mark3D Access Token",
      "MARK3D",
      "",
      globalSalt,
      collectionToClone.address,
      true,
      fraudDecider.address
    );
    const salt = genRanHex(64);
    await accessToken.connect(accounts[1]).createCollection("0x" + salt,
      "TEST", "TEST", "", "", "0x");
    const collectionAddress = await accessToken.predictDeterministicAddress("0x" + salt);
    collectionInstance = collectionFactory.attach(collectionAddress);
    exchangeInstance = await exchangeFactory.deploy();
  });

  it("mint", async () => {
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
    await collectionInstance.connect(accounts[1]).mintWithoutId(accounts[1].getAddress(), "a", "0x");
  });

  it("approve", async () => {
    await collectionInstance.connect(accounts[1]).setApprovalForAll(exchangeInstance.address, true);
  });

  it("create order", async () => {
    await exchangeInstance.connect(accounts[1]).placeOrder(collectionInstance.address, BN.from(0), BN.from(10000));
    await exchangeInstance.connect(accounts[1]).placeOrder(collectionInstance.address, BN.from(1), BN.from(10000));
  });

  it("fulfill order no whitelist", async () => {
    await ethers.provider.send("evm_mine", [start + 2]);
    const tx = exchangeInstance.connect(accounts[2])
      .fulfillOrderWhitelisted(collectionInstance.address, "0xa1", BN.from(0), "0x", {
        value: BN.from(10000)
      });
    await expect(tx).to.revertedWith("Mark3dExchange: collection doesn't have whitelist");
  });

  it("set whitelist", async () => {
    await ethers.provider.send("evm_mine", [start + 5]);
    await exchangeInstance.connect(accounts[0]).setWhitelistParams(collectionInstance.address, BN.from(start), BN.from(5000))

    const deadline = await exchangeInstance.whitelistDeadlines(collectionInstance.address);
    const discount = await exchangeInstance.whitelistDiscounts(collectionInstance.address);
    expect(deadline).to.equal(BN.from(start));
    expect(discount).to.equal(BN.from(5000));
  });

  it("whitelist deadline exceeds", async () => {
    await ethers.provider.send("evm_mine", [start + 8]);

    const tx = exchangeInstance.connect(accounts[2])
      .fulfillOrderWhitelisted(collectionInstance.address, "0xa1", BN.from(0), "0x", {
        value: BN.from(10000)
      });
    await expect(tx).to.revertedWith("Mark3dExchange: whitelist deadline exceeds");
  });

  it("fulfill with whitelist deadline exceeds", async () => {
    await ethers.provider.send("evm_mine", [start + 11]);

    const tx = await exchangeInstance.connect(accounts[2])
      .fulfillOrder(collectionInstance.address, "0xa1", BN.from(0), {
        value: BN.from(10000)
      });
    await expect(tx)
      .to
      .emit(collectionInstance, "TransferDraftCompletion")
      .withArgs(BN.from(0), await accounts[2].getAddress())
  });

  it("set whitelist", async () => {
    await ethers.provider.send("evm_mine", [start + 14]);

    await exchangeInstance.connect(accounts[0]).setWhitelistParams(collectionInstance.address, BN.from(start + 30), BN.from(5000))

    const deadline = await exchangeInstance.whitelistDeadlines(collectionInstance.address);
    const discount = await exchangeInstance.whitelistDiscounts(collectionInstance.address);
    expect(deadline).to.equal(BN.from(start + 30));
    expect(discount).to.equal(BN.from(5000));
  });

  it("invalid signature", async () => {
    await ethers.provider.send("evm_mine", [start + 17]);
    const tx = exchangeInstance.connect(accounts[2])
      .fulfillOrderWhitelisted(collectionInstance.address, "0xa1", BN.from(1),
        "0xa05ddc17394905fec70b15fc3209bd972f4dc2a53cb5168a3906a52c423928156e73c24e9915c8b116c6beb9e4b90f941ded6eddcdfbc89eb9f92a52ccf94e551b",
        {
          value: BN.from(10000)
        });
    await expect(tx).to.revertedWith("Mark3dExchange: whitelist invalid signature");

  });

  it("fulfill with whitelist disabled", async () => {
    await ethers.provider.send("evm_mine", [start + 20]);

    const tx = exchangeInstance.connect(accounts[2])
      .fulfillOrder(collectionInstance.address, "0xa1", BN.from(1), {
        value: BN.from(10000)
      });
    await expect(tx).to.revertedWith("Mark3dExchange: whitelist period");
  });

  it("fulfill whitelist wrong price", async () => {
    await ethers.provider.send("evm_mine", [start + 23]);

    const tx = exchangeInstance.connect(accounts[2])
      .fulfillOrderWhitelisted(collectionInstance.address, "0xa1", BN.from(1),
        "0x1939d953cd4e47fe7e2f1e454ff366caf7e58d3a4a6a4a0e6a6ce2c4b22fdcbe0a460e1730fc0b538f4f4e167ef1b9307d403fe1af34e2b1ef1904d6d7750c831c",
        {
          value: BN.from(10000)
        });

    await expect(tx).to.revertedWith("Mark3dExchange: value must equal price with discount");
  })

  it("fulfill whitelist success", async () => {
    await ethers.provider.send("evm_mine", [start + 26]);

    const tx = await exchangeInstance.connect(accounts[2])
      .fulfillOrderWhitelisted(collectionInstance.address, "0xa1", BN.from(1),
        "0x1939d953cd4e47fe7e2f1e454ff366caf7e58d3a4a6a4a0e6a6ce2c4b22fdcbe0a460e1730fc0b538f4f4e167ef1b9307d403fe1af34e2b1ef1904d6d7750c831c",
        {
          value: BN.from(5000)
        });

    await expect(tx)
      .to
      .emit(collectionInstance, "TransferDraftCompletion")
      .withArgs(BN.from(1), await accounts[2].getAddress())
  })
});

describe("Trade token with fraud not approved", async () => {
  let accounts: Signer[];
  let accessToken: Mark3dAccessToken;
  let fraudDecider: FraudDeciderWeb2;
  let collectionInstance: Mark3dCollection;
  let exchangeInstance: Mark3dExchange;

  before(async () => {
    accounts = await ethers.getSigners();

    const accessTokenFactory = new Mark3dAccessToken__factory(accounts[0]);
    const fraudDeciderFactory = new FraudDeciderWeb2__factory(accounts[0]);
    const collectionFactory = new Mark3dCollection__factory(accounts[0]);
    const exchangeFactory = new Mark3dExchange__factory(accounts[0]);

    const collectionToClone = await collectionFactory.deploy();
    fraudDecider = await fraudDeciderFactory.deploy();

    const encoder = new TextEncoder();
    const globalSalt = ethers.utils.hexlify(encoder.encode("Global Salt"));

    accessToken = await accessTokenFactory.deploy(
      "Mark3D Access Token",
      "MARK3D",
      "",
      globalSalt,
      collectionToClone.address,
      true,
      fraudDecider.address
    );
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

    const encoder = new TextEncoder();
    const globalSalt = ethers.utils.hexlify(encoder.encode("Global Salt"));

    accessToken = await accessTokenFactory.deploy(
      "Mark3D Access Token",
      "MARK3D",
      "",
      globalSalt,
      collectionToClone.address,
      true,
      fraudDecider.address
    );
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
