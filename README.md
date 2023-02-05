> Project Description
Online shop and storefronts constructor with focusing on store, sell, buy or send any files as NFT 2.0 with new Encrypted FileToken standart on FVM

Here is our tech article about EFT on Medium and we need your claps: https://medium.com/mark3d-xyz/how-to-attach-an-encrypted-file-to-your-nft-7d6232fd6d34

We are building a network of online shops of NFT files stored and encrypted on Filecoin using Lighthouse storage to upload content to storage providers, with accumulation of all files on a common large FileMarket Hub.

To store encrypted and protected from unauthorized copying files within NFT, we have developed our Encrypted FileToken standard. It is designed to solve NFT's "right-click-save" problem.

There is currently no way to swap encrypted files for crypto securely in the market for downloadable digital content. Having a web3 marketplace with a focus on trading files rather than digital art will solve this problem.

However, digital content creators often don't want to share their traffic with general storefronts to avoid switching it to other creators. Authors want their own branded online file store. But own Web3 online shop for files is too expensive and takes too much time.

That is why we offer authors to make their own online store for digital content. In the first stage by ordering it from our team, and later using our own constructor and FileMarket SDK.

Based on the mechanics of encrypted file tokenization, we are taking an evolutionary step in the market for sold digital content, especially in the segments:

Monetization of AI-generated content
3D models and Metaverse spaces
sale of exclusive content from bloggers and Influencers
templates and stock content
selling software and code repositories
Business model includes:

White label Web3 Online shops sales
Commission from every trade transaction
Inner catalog, ads and promotion for online shops
Primary audience: Individual creators and creative studios

> How it's Made

We use symmetric encryption of the file uploaded to Filecoin at the time of mint NFT. We use Lighthouse storage service to upload files. For minting and other functions we developed smart contracts on FEVM.

When someone buys an NFT, he freezes the amount in tokens for payment on the smart contract and sends a Public Key to the seller. The seller in a separate transaction using asymmetric encryption sends the encrypted file decryption key to the buyer.

Using Lighthouse storage, the buyer downloads the decrypted file from the Filecoin decentralized storage.

In the background, the FileMarket backend listens to all the transactions for the fraud reports. If the encrypted file received by the buyer does not match the original sample or cannot be decrypted, the buyer can send a report to the fraud.

Otherwise, if the buyer is satisfied, he completes the transaction by unfreezing the reserved funds and transferring them to the seller in a new transaction.

The encrypted file is now available to the new NFT owner and unavailable to the old one.

The NFT owner can initiate its own transfer to an address he knows and then the recipient must accept the transaction and the transaction enters a similar cycle to a sale with the public key being transferred to the seller and the decryption key being transferred back to the buyer.
