import {ethers} from "hardhat";
import { program } from "commander";
import {
    FileBunniesCollection__factory,
     FilemarketExchangeV2__factory,
} from "../typechain-types";
import {BigNumber} from "ethers";

const util = require("util")
const request = util.promisify(require("request"))

const zeroAddress = "0x0000000000000000000000000000000000000000";

function getRandomElements(arr: string[], count: number) {
    let copyArr = [...arr];
    let m = copyArr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = copyArr[m];
        copyArr[m] = copyArr[i];
        copyArr[i] = t;
    }
    return copyArr.slice(0, count);
}

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
    const shouldApprove = false;

    let accounts = await ethers.getSigners();
    console.log(accounts);

    const priorityFee = await callRpc("eth_maxPriorityFeePerGas", "")
    console.log(priorityFee)

    const cidArr = [
        "QmfYFM2Jy7HQFAALtabLHkhBDpho4eDiyxbDyeaPsr9SGr",
        "QmcqMogBNsMcCFqyWpYmuq2HwW9uxA8NPPmWaBFhQftoL6",
        "Qmf7z8x8GZctBQVKWiG7mK7Dyem4C1BChb2Fn2DXQ2s8i1",
        "QmP43LR46JsT89H8NxqUMnNhp3dZWC7M7RhCAAuUq2uz3U",
        "QmY9qmhekGzGSr2re4KpxjSFpz2J7Y7D3jDWvo6VHDDu3H",
        "Qmc39s2ULkfftLy2kQjTvVEkxNdMXvWdjuPGhbWZaummXw",
        "QmazgM4cxKBmLFGTP2EjMz588r1BZYqhefp6N1S26KzazR",
        "QmfR3HNVMH78zwvFnA2YxKW3t8ahGGbuB622UrbTkS8sUG",
        "QmT3PqP4h6tUsR8Kyii8ExrSJJYFgEBrHpERXLQGDjYTtt",
        "QmTLpJtYyo21CVun4hbsGprb4Jog75Kt2kecniT3Newxhx",
        "QmQt7wwQR3MXsPnkq5bv1j7gnQTE5GTqPQFTG8BcJgemz6",
        "QmPpZq4KC2iPyvdAWs8isVLhL9zRhpjXsGUGCruRbouMWm",
        "QmTSU43Boga2JueS4pWw7WHpQd72weftjKewj1Mw14QW11",
        "QmUiK7ni1PAboWpuj4oRTguhgqcLpancTy62vKwiDeBezQ",
        "QmXrZmeebtFhKfctzkAR5LnCRcuXotKBE9UtYsqB23Husi",
        "QmUxTgRpmX5h2TcU9cNbf3SnyGQxnJoqc9W9ehjEUbm5nb",
        "QmakjZrwGpfAyzRT54CsceVJk4WqYFjHnkdPNu1jBoEZoE",
        "QmSd371kpWoJFPvz5edyHsGahWyMaPnNvAYQnaBjpqqhVt",
        "QmPDz7qUUByT98xEUf4Nat7uLG4ghdn4e9nd2ThEahA51u",
        "QmNRzuKZUK4unuJeHxMYzsrBrYuKe9d8YWJf5rLQyRtRZh",
        "Qma3ptbCZ7CANzrw9doFFkneiTRnrjeg56EC2CB6XQEzSa",
        "QmUeMPAWUgJjAKZSHNTRNXEwKLu9k6FVRpQjCwrGsFrYdx",
        "QmX7UxHEVge76pncp7SjK1wyAcgR4uWcESkLKxMWmJ86RY",
        "QmRZ2nh3AUssDJ97eUonLCPG5gn8FJjJmbvkJxrtUPvpx5",
        "QmXXqpX8YbBkYwHRz9SH4U4kFTUa2qcPR1ymk2nYXekbfC",
        "QmZz1g1gguduaE9UKyyuuTsEfKCQHxQHk8X7JiAZsnyZPt",
        "QmeYQkGDrSKBjWKRRioPDtrxHNVNR6fY1MnYQtVGtka854",
        "QmayHHLzqj2yN1d69CbGxnF3kth2WraA5FFCYiUuiHPKnG",
        "QmfSFUtxhXpqDtiFEBShfmKjUBpaMiespPpmTeVk1UgNBK",
        "Qmea3Y1SK2iwAXpDG4ucAupQAXLokeueTumTJLHgq6NEMX",
        "Qmdb53GtnGvxH9zcG4dbtjtgU5GkmHNdnXXX4xg5CdXNgx",
        "QmQKotLCydkwboeDMTobtwfRkBHXHhPXZq2vuGNspk4swL",
        "QmTo5DivPXa8oyD31SWwSYuLS6JTAjpdPYuySzvYRjMEBq",
        "QmPNGJR23m2HXZ5hurXg9f7APxv2uy4VunXp595qFiScvV",
        "QmWUwEhp37MKCdbX5PZFPN8jyGDwA62XNMepQ9ifKfU1kF",
        "QmQUwC9iJpvMoiYm46WnCSa1KcS2JR9shqbXnr9xiSYKRL",
        "QmXCxw4AHa2WADoBrNmEV8tPGWCWjR3iobJf7ww7yJpQhW",
        "QmeASn1B2CAXukQ3ZW6tFJhwmG1pGRHw2Pq9TPiHjzxgR7",
        "Qme7tB4UMuFMsN4P14LJqB5u3hCdC7XUZMiomTsGMWMHMf",
        "QmaXJzrJHh6MsD5gc4TAmyv8zrEMPkJnU1ZTuKLYHmEyTe",
    ];

    const fileBunniesCollectionFactory = new FileBunniesCollection__factory(accounts[0]);
    const exchangeFactory = new FilemarketExchangeV2__factory(accounts[0]);

    const fbCollection = await fileBunniesCollectionFactory.attach("0xdba60722700dbb8c0ec5339b6505a89f3bd4a17e");
    const exchange = await exchangeFactory.attach("0x2301D80E8A7e4Cf59a349ffC20A51367cb27A4fc");

    // Approve
    if (shouldApprove) {
        console.log("approve:", await fbCollection
            .connect(accounts[0])
            .setApprovalForAll(exchange.address, true, {maxPriorityFeePerGas: priorityFee}));
    }

    const step = 20;
    for (let i = BigNumber.from(0); i.lt(BigNumber.from(1000)); i = i.add(BigNumber.from(step))) {
        const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
            accounts[0].getAddress(),
            i,
            BigNumber.from(step),
            4321,
            Array(step).fill("0x"),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx)

        const tx2 = await fbCollection.connect(accounts[0]).addCommonCids(
            i,
            getRandomElements(cidArr, step),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx2);

        let tokenIds = []
        for (let j = i; j.lt(i.add(step)); j = j.add(1)) {
            tokenIds.push(j);
        }
        const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
            fbCollection.address,
            tokenIds,
            BigNumber.from(1),
            zeroAddress,
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx3);

        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    for (let i = BigNumber.from(6000); i.lt(BigNumber.from(7000)); i = i.add(BigNumber.from(step))) {
        const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
            accounts[0].getAddress(),
            i,
            BigNumber.from(step),
            4321,
            Array(step).fill("0x"),
            {maxPriorityFeePerGas: priorityFee}
        )
        console.log(i, tx)

        const tx2 = await fbCollection.connect(accounts[0]).addUncommonCids(
            i,
            getRandomElements(cidArr, step),
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx2);

        let tokenIds = []
        for (let j = i; j.lt(i.add(step)); j = j.add(1))
            tokenIds.push(j);
        const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
            fbCollection.address,
            tokenIds,
            BigNumber.from(1),
            zeroAddress,
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx3);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    for (let i = BigNumber.from(7000); i.lt(BigNumber.from(8000)); i = i.add(BigNumber.from(step))) {
        if (!i.eq(7000)) {
            const tx = await fbCollection.connect(accounts[0]).mintBatchWithoutMeta(
                accounts[0].getAddress(),
                i,
                BigNumber.from(step),
                4321,
                Array(step).fill("0x"),
                {maxPriorityFeePerGas: priorityFee}
            )
            console.log(i, tx)

            const tx2 = await fbCollection.connect(accounts[0]).addPayedCids(
                i,
                getRandomElements(cidArr, step),
                {maxPriorityFeePerGas: priorityFee}
            );
            console.log(i, tx2);
        }

        let tokenIds = []
        for (let j = i; j.lt(i.add(step)); j = j.add(1))
            tokenIds.push(j);
        const tx3 = await exchange.connect(accounts[0]).placeOrderBatch(
            fbCollection.address,
            tokenIds,
            BigNumber.from(10).pow(16), // 0.01
            zeroAddress,
            {maxPriorityFeePerGas: priorityFee}
        );
        console.log(i, tx3);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
