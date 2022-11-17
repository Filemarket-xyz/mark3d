import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types/config";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";

const mumbaiAccounts: string[] = [];

if (fs.existsSync(".mumbai-secret")) {
  mumbaiAccounts.push(fs.readFileSync(".mumbai-secret").toString().trim());
}
const mumbaiConfig: HttpNetworkUserConfig = {
  url: "https://matic-mumbai.chainstacklabs.com/",
  chainId: 80001,
  accounts: mumbaiAccounts,
};
if (process.env.POLYGON_QUIKNODE_URL) {
  mumbaiConfig.url = process.env.POLYGON_QUIKNODE_URL;
}
console.log("mumbai cfg:", mumbaiConfig);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: mumbaiConfig,
  },
  etherscan: {
    apiKey: {
      polygon:
        process.env.MINTER_GURU_POLYGONSCAN_API_KEY !== undefined
          ? process.env.MINTER_GURU_POLYGONSCAN_API_KEY
          : "",
      polygonMumbai:
        process.env.MINTER_GURU_POLYGONSCAN_API_KEY !== undefined
          ? process.env.MINTER_GURU_POLYGONSCAN_API_KEY
          : "",
    },
  },
};

export default config;
