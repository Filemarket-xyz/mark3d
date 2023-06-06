import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber as BN, Signer } from "ethers";
import {
    FileBunniesCollection,
    FileBunniesCollection__factory,
    FraudDeciderWeb2V2,
    FraudDeciderWeb2V2__factory,
} from "../typechain-types";
import "@nomicfoundation/hardhat-chai-matchers";

describe("Success transfer", async () => {
    let accounts: Signer[];
    let fraudDecider: FraudDeciderWeb2V2;
    let collectionInstance: FileBunniesCollection;

    before(async () => {
        accounts = await ethers.getSigners();
        const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
        const collectionFactory = new FileBunniesCollection__factory(accounts[0]);

        fraudDecider = await fraudDeciderFactory.deploy();
        collectionInstance = await collectionFactory.deploy(
            "Collection name",
            "CN",
            "",
            accounts[1].getAddress(),
            accounts[3].getAddress(),
            accounts[4].getAddress(),
            accounts[5].getAddress(),
            "0x",
            fraudDecider.address,
            true
        );
    });

    it("mint", async () => {
        await collectionInstance
            .connect(accounts[1])
            .mint(accounts[1].getAddress(), BN.from(0), "a", 1_000, "0x");
    });

    it("init transfer", async () => {
        const tokenId = BN.from(0);
        let transferNumber = await collectionInstance.transferCounts(tokenId);
        transferNumber = transferNumber.add(1); // count increments in initTransfer and before emitting

        const tx = await collectionInstance
            .connect(accounts[1])
            .initTransfer(
                tokenId,
                accounts[2].getAddress(),
                "0x",
                ethers.constants.AddressZero
            );
        await expect(tx)
            .to.emit(collectionInstance, "TransferInit")
            .withArgs(
                tokenId,
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                transferNumber
            );
    });

    it("set public key", async () => {
        const tokenId = BN.from(0);
        const transferNumber = await collectionInstance.transferCounts(tokenId);
        const tx = await collectionInstance
            .connect(accounts[2])
            .setTransferPublicKey(tokenId, "0x12", transferNumber);
        await expect(tx)
            .to.emit(collectionInstance, "TransferPublicKeySet")
            .withArgs(tokenId, "0x12");
    });

    it("set encrypted password", async () => {
        const tx = await collectionInstance
            .connect(accounts[1])
            .approveTransfer(BN.from(0), "0x34");
        await expect(tx)
            .to.emit(collectionInstance, "TransferPasswordSet")
            .withArgs(BN.from(0), "0x34");
    });

    it("mint batch", async () => {
        await collectionInstance
            .connect(accounts[1])
            .mintBatchWithoutMeta(
                accounts[0].getAddress(),
                BN.from(5990),
                BN.from(20),
                1_000,
                Array(20).fill("0x")
            );

        const common = await collectionInstance.commonTokensCount();
        const uncommon = await collectionInstance.uncommonTokensCount();
        const payed = await collectionInstance.payedTokensCount();

        expect(common.eq(BN.from(10 + 1))).true; // +1 because we've minted a common earlier
        expect(uncommon.eq(BN.from(10))).true;
        expect(payed.eq(BN.from(0))).true;
    });

    it("add cids", async () => {
        const commonArr = Array(1).fill("common cid");
        const uncommonArr = Array(10).fill("uncommon cid");

        await collectionInstance
            .connect(accounts[1])
            .addCommonCids(BN.from(0), commonArr);

        await collectionInstance
            .connect(accounts[1])
            .addUncommonCids(BN.from(6000), uncommonArr);

        expect(await collectionInstance.commonCids(BN.from(0))).eq("common cid");

        for (let i = BN.from(0); i.lt(10); i = i.add(BN.from(1))) {
            expect(await collectionInstance.uncommonCids(i)).eq("uncommon cid");
        }
    });

    it("finalize transfer", async () => {
        const tokenId = BN.from(0);
        const tx = await collectionInstance
            .connect(accounts[2])
            .finalizeTransfer(tokenId);
        await expect(tx)
            .to.emit(collectionInstance, "TransferFinished")
            .withArgs(tokenId);
        await expect(tx)
            .to.emit(collectionInstance, "Transfer")
            .withArgs(
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                tokenId
            );

        const meta = await collectionInstance
            .connect(accounts[2])
            .tokenUris(tokenId);
        expect(meta).eq("a");
    });

    it("ownership should should change after transfer", async () => {
        const tokenOwner = await collectionInstance.ownerOf(BN.from(0));
        expect(tokenOwner).eq(await accounts[2].getAddress());
    });
});

describe("Transfer with fraud", async () => {
    let accounts: Signer[];
    let fraudDecider: FraudDeciderWeb2V2;
    let collectionInstance: FileBunniesCollection;

    before(async () => {
        accounts = await ethers.getSigners();

        const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
        const collectionFactory = new FileBunniesCollection__factory(accounts[0]);

        fraudDecider = await fraudDeciderFactory.deploy();
        collectionInstance = await collectionFactory.deploy(
            "Collection name",
            "CN",
            "",
            accounts[1].getAddress(),
            accounts[3].getAddress(),
            accounts[4].getAddress(),
            accounts[5].getAddress(),
            "0x",
            fraudDecider.address,
            true
        );
    });

    it("mint", async () => {
        await collectionInstance
            .connect(accounts[1])
            .mint(accounts[1].getAddress(), BN.from(0), "b", 1_000, "0x");
    });

    it("init transfer", async () => {
        const tokenId = BN.from(0);
        let transferNumber = await collectionInstance.transferCounts(tokenId);
        transferNumber = transferNumber.add(1); // count increments in initTransfer and before emitting

        const tx = await collectionInstance
            .connect(accounts[1])
            .initTransfer(
                BN.from(0),
                accounts[2].getAddress(),
                "0x",
                ethers.constants.AddressZero
            );
        await expect(tx)
            .to.emit(collectionInstance, "TransferInit")
            .withArgs(
                BN.from(0),
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                transferNumber
            );
    });

    it("set public key", async () => {
        const tokenId = BN.from(0);
        const transferNumber = await collectionInstance.transferCounts(tokenId);
        const tx = await collectionInstance
            .connect(accounts[2])
            .setTransferPublicKey(tokenId, "0x1234", transferNumber);
        await expect(tx)
            .to.emit(collectionInstance, "TransferPublicKeySet")
            .withArgs(BN.from(0), "0x1234");
    });

    it("set encrypted password", async () => {
        const tx = await collectionInstance
            .connect(accounts[1])
            .approveTransfer(BN.from(0), "0x3421");
        await expect(tx)
            .to.emit(collectionInstance, "TransferPasswordSet")
            .withArgs(BN.from(0), "0x3421");
    });

    it("report fraud", async () => {
        const tx = await collectionInstance
            .connect(accounts[2])
            .reportFraud(BN.from(0), "0x12");
        await expect(tx)
            .to.emit(collectionInstance, "TransferFraudReported")
            .withArgs(BN.from(0));
    });

    it("fraud approved", async () => {
        const tx = await fraudDecider
            .connect(accounts[0])
            .lateDecision(collectionInstance.address, BN.from(0), false);
        await expect(tx)
            .to.emit(collectionInstance, "TransferFraudDecided")
            .withArgs(BN.from(0), false);
        await expect(tx)
            .to.emit(collectionInstance, "Transfer")
            .withArgs(
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                BN.from(0)
            );
    });
});

describe("Success transfer with freemint", async () => {
    let accounts: Signer[];
    let fraudDecider: FraudDeciderWeb2V2;
    let collectionInstance: FileBunniesCollection;

    before(async () => {
        accounts = await ethers.getSigners();
        const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
        const collectionFactory = new FileBunniesCollection__factory(accounts[0]);

        fraudDecider = await fraudDeciderFactory.deploy();
        collectionInstance = await collectionFactory.deploy(
            "Collection name",
            "CN",
            "",
            accounts[1].getAddress(),
            accounts[0].getAddress(),
            accounts[4].getAddress(),
            accounts[5].getAddress(),
            "0x",
            fraudDecider.address,
            true
        );
    });

    it("mint", async () => {
        await collectionInstance
            .connect(accounts[1])
            .mintBatchWithoutMeta(
                accounts[1].getAddress(),
                BN.from(0),
                BN.from(1),
                1_000,
                ["0x"]
            );
    });

    it("init transfer", async () => {
        const tokenId = BN.from(0);
        let transferNumber = await collectionInstance.transferCounts(tokenId);
        transferNumber = transferNumber.add(1); // count increments in initTransfer and before emitting

        const tx = await collectionInstance
            .connect(accounts[1])
            .initTransfer(
                tokenId,
                accounts[2].getAddress(),
                "0x",
                ethers.constants.AddressZero
            );
        await expect(tx)
            .to.emit(collectionInstance, "TransferInit")
            .withArgs(
                tokenId,
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                transferNumber
            );
    });

    it("set public key", async () => {
        const tokenId = BN.from(0);
        const transferNumber = await collectionInstance.transferCounts(tokenId);
        const tx = await collectionInstance
            .connect(accounts[2])
            .setTransferPublicKey(tokenId, "0x12", transferNumber);
        await expect(tx)
            .to.emit(collectionInstance, "TransferPublicKeySet")
            .withArgs(tokenId, "0x12");
    });

    it("set encrypted password", async () => {
        const tx = await collectionInstance
            .connect(accounts[1])
            .approveTransfer(BN.from(0), "0x34");
        await expect(tx)
            .to.emit(collectionInstance, "TransferPasswordSet")
            .withArgs(BN.from(0), "0x34");
    });

    it("add cids", async () => {
        const commonArr = Array(1).fill("common cid");
        const uncommonArr = Array(10).fill("uncommon cid");

        await collectionInstance
            .connect(accounts[1])
            .addCommonCids(BN.from(0), commonArr);

        await collectionInstance
            .connect(accounts[1])
            .addUncommonCids(BN.from(6000), uncommonArr);

        expect(await collectionInstance.commonCids(BN.from(0))).eq("common cid");

        for (let i = BN.from(0); i.lt(10); i = i.add(BN.from(1))) {
            expect(await collectionInstance.uncommonCids(i)).eq("uncommon cid");
        }
    });

    it("finalize transfer", async () => {
        const tokenId = BN.from(0);
        const tx = await collectionInstance
            .connect(accounts[2])
            .finalizeTransfer(tokenId);
        await expect(tx)
            .to.emit(collectionInstance, "TransferFinished")
            .withArgs(tokenId);
        await expect(tx)
            .to.emit(collectionInstance, "Transfer")
            .withArgs(
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                tokenId
            );

        const meta = await collectionInstance
            .connect(accounts[2])
            .tokenUris(tokenId);
        expect(meta).eq("common cid");
    });

    it("ownership should should change after transfer", async () => {
        const tokenOwner = await collectionInstance.ownerOf(BN.from(0));
        expect(tokenOwner).eq(await accounts[2].getAddress());
    });
});

describe("Freemint with fraud not approved", async () => {
    let accounts: Signer[];
    let fraudDecider: FraudDeciderWeb2V2;
    let collectionInstance: FileBunniesCollection;

    before(async () => {
        accounts = await ethers.getSigners();

        const fraudDeciderFactory = new FraudDeciderWeb2V2__factory(accounts[0]);
        const collectionFactory = new FileBunniesCollection__factory(accounts[0]);

        fraudDecider = await fraudDeciderFactory.deploy();
        collectionInstance = await collectionFactory.deploy(
            "Collection name",
            "CN",
            "",
            accounts[1].getAddress(),
            accounts[3].getAddress(),
            accounts[4].getAddress(),
            accounts[5].getAddress(),
            "0x",
            fraudDecider.address,
            true
        );
    });

    it("mint", async () => {
        await collectionInstance
            .connect(accounts[1])
            .mintBatchWithoutMeta(
                accounts[1].getAddress(),
                BN.from(0),
                BN.from(1),
                1_000,
                ["0x"]
            );
    });

    it("add cids", async () => {
        const commonArr = Array(1).fill("common cid");
        const uncommonArr = Array(10).fill("uncommon cid");

        await collectionInstance
            .connect(accounts[1])
            .addCommonCids(BN.from(0), commonArr);

        await collectionInstance
            .connect(accounts[1])
            .addUncommonCids(BN.from(6000), uncommonArr);

        expect(await collectionInstance.commonCids(BN.from(0))).eq("common cid");

        for (let i = BN.from(0); i.lt(10); i = i.add(BN.from(1))) {
            expect(await collectionInstance.uncommonCids(i)).eq("uncommon cid");
        }
    });

    it("init transfer", async () => {
        const tokenId = BN.from(0);
        let transferNumber = await collectionInstance.transferCounts(tokenId);
        transferNumber = transferNumber.add(1); // count increments in initTransfer and before emitting

        const tx = await collectionInstance
            .connect(accounts[1])
            .initTransfer(
                BN.from(0),
                accounts[2].getAddress(),
                "0x",
                ethers.constants.AddressZero
            );
        await expect(tx)
            .to.emit(collectionInstance, "TransferInit")
            .withArgs(
                BN.from(0),
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                transferNumber
            );
    });

    it("set public key", async () => {
        const tokenId = BN.from(0);
        const transferNumber = await collectionInstance.transferCounts(tokenId);
        const tx = await collectionInstance
            .connect(accounts[2])
            .setTransferPublicKey(tokenId, "0x1234", transferNumber);
        await expect(tx)
            .to.emit(collectionInstance, "TransferPublicKeySet")
            .withArgs(BN.from(0), "0x1234");
    });

    it("set encrypted password", async () => {
        const tx = await collectionInstance
            .connect(accounts[1])
            .approveTransfer(BN.from(0), "0x3421");
        await expect(tx)
            .to.emit(collectionInstance, "TransferPasswordSet")
            .withArgs(BN.from(0), "0x3421");
    });

    it("report fraud", async () => {
        const tx = await collectionInstance
            .connect(accounts[2])
            .reportFraud(BN.from(0), "0x12");
        await expect(tx)
            .to.emit(collectionInstance, "TransferFraudReported")
            .withArgs(BN.from(0));
    });

    it("fraud not approved", async () => {
        const tx = fraudDecider
            .connect(accounts[0])
            .lateDecision(collectionInstance.address, BN.from(0), false);
        await expect(tx)
            .to
            .emit(collectionInstance, "TransferFraudDecided")
            .withArgs(BN.from(0), false);
        await expect(tx)
            .to.emit(collectionInstance, "Transfer")
            .withArgs(
                await accounts[1].getAddress(),
                await accounts[2].getAddress(),
                BN.from(0)
            );
    });
});