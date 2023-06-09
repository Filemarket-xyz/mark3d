import {ethers} from "hardhat";
import { program } from "commander";
import {
    FileBunniesCollection__factory,
     FilemarketExchangeV2__factory,
} from "../typechain-types";
import {BigNumber} from "ethers";

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
    console.log(accounts);

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
    console.log(priorityFee)

    const cidArr = [
        "QmVktEHCq3RaNYhbXfpNPjSiozYNLTu4xSugrKtN4nSPca",
        "QmX7w7JcfB71Xj9LambY7oLTExWvtk327q39vNy1xjMXe4",
        "QmZ65jVXSuPkmXdjT1bq7mf89Xyt86gexRsLughryyeZd2",
        "QmPWbJWZXrCtk8pwAFmoh7ovX7DyDkaPLnHJaYajNvaikX",
        "QmPff3xMpq93nJXiNVFpupVdJEMHADCmuT6oD3dsxgDtHL",
        "QmYKdYWHWUFLuuEkrBj2W5YcTKQxfx2CLnxgUAq1yANTKW",
        "QmdZZW7GsEE98A1KPw84AH4rbqcnPhemhFhiQLCnwMcVcB",
        "QmYLCanYHYVc4ksYg7gosNav8JUJekM64AN7eSRAetBd4E",
        "QmY5xyUnpCNaRR3BVH55UsTMHjB3AwT8ASCJAyazpw9cdU",
        "QmdkAJ4gUJfcDSaYcxztLg3UECB8BivranMDjdMtJoHhG8",
        "QmTfWEbG5n3oRUDsxRmoZNv2hjA4skEPK2aBjX6o7tnJVH",
        "QmfN5icNw4UApeS1A5zaXZrSWXpF8G4nkvNn2dz5yWqehF",
        "QmUhw1cgRRDgwqVQXQ4GcgoXKgVDJVwhtD3VkmzNYfVX3v",
        "QmS8bd2oFyjwtQakSe1KDM5KtaxeDSWZQAiF2csiWQcLBr",
        "Qmcx9yt2iBpCwj5Ez193RqjbsEfb7zSVs2Lf8wnbEi25vX",
        "QmT4NbSHU7Pf8fytqW45MLoL5TELB7E5JMkosBuU7LsjFP",
        "QmbgNjP2YZf5Ccggz7MtJV1HkJucGiexz6wDphZwpG3rXM",
        "QmXtYy774X7k7fXPXZWvXFKgNjGxeyuosvG1o7mRxTdq4z",
        "Qmewr7ZXvunFSTmYjqAgiyaC43YYRhWCQh3fX58LeeCbEL",
        "QmcXTbSZU7EkCRD1HUmAguyUwGex2vBNFsLkKZJiyw8trN",
        "QmYomdEZfo8FURXvWG7rxFtRpHC9FM9dMEpfncSrWfSRtc",
        "QmV8ypU4D8Wr9nt29y6MKE29XthEZSbghXpAERidh9fEQt",
        "QmWtYuyfcnEnkhvqj1ZxUpxv8ANw9HzHpU68qLrqWpoced",
        "QmfTWADUEfhDnaX88DWBdvNAAXA4mpuF5i2KkFFiSzgfYn",
        "QmcyLD8duMP53WdkYmJLQE2Q2sUuMEEwYLbfcyCxhuxFL3",
    ];

    const fileBunniesCollectionFactory = new FileBunniesCollection__factory(accounts[0]);
    const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

    const fbCollection = await fileBunniesCollectionFactory.attach("0xA1A88CfA5222f47EdD89587d9c0fa89AE3988De6");
    console.log(fbCollection.address)

    console.log("common: ", await fbCollection.connect(accounts[0]).commonTokensCount({maxPriorityFeePerGas: priorityFee}))
    console.log("uncommon: ", await fbCollection.connect(accounts[0]).uncommonTokensCount({maxPriorityFeePerGas: priorityFee}))
    console.log("payed: ", await fbCollection.connect(accounts[0]).payedTokensCount({maxPriorityFeePerGas: priorityFee}))

    for (let i = BigNumber.from(0); i.lt(BigNumber.from(6000)); i = i.add(BigNumber.from(50))) {
        const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
            accounts[0].getAddress(),
            i,
            BigNumber.from(50),
            4321,
            Array(50).fill("0x"),
            {maxPriorityFeePerGas: priorityFee}
        )
        console.log(i, tx)

        const tx2 = await fbCollection.connect(accounts[0]).addCommonCids(
            i,
            cidArr.concat(cidArr),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx2);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    for (let i = BigNumber.from(6000); i.lt(BigNumber.from(7000)); i = i.add(BigNumber.from(50))) {
        const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
            accounts[0].getAddress(),
            i,
            BigNumber.from(50),
            4321,
            Array(50).fill("0x"),
            {maxPriorityFeePerGas: priorityFee}
        )
        console.log(i, tx)

        const tx2 = await fbCollection.connect(accounts[0]).addUncommonCids(
            i,
            cidArr.concat(cidArr),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx2);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    for (let i = BigNumber.from(7000); i.lt(BigNumber.from(10000)); i = i.add(BigNumber.from(50))) {
        const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
            accounts[0].getAddress(),
            i,
            BigNumber.from(50),
            4321,
            Array(50).fill("0x"),
            {maxPriorityFeePerGas: priorityFee}
        )
        console.log(i, tx)

        const tx2 = await fbCollection.connect(accounts[0]).addPayedCids(
            i,
            cidArr.concat(cidArr),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx2);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log("common: ", await fbCollection.connect(accounts[0]).commonTokensCount({maxPriorityFeePerGas: priorityFee}))
    console.log("uncommon: ", await fbCollection.connect(accounts[0]).uncommonTokensCount({maxPriorityFeePerGas: priorityFee}))
    console.log("payed: ", await fbCollection.connect(accounts[0]).payedTokensCount({maxPriorityFeePerGas: priorityFee}))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
