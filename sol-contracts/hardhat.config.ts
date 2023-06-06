import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig } from "hardhat/types/config";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";

const mumbaiAccounts: string[] = [];
// const hyperspaceAccounts: string[] = [];
const calibrationAccounts: string[] = [];
const filecoinAccounts: string[] = [];

if (fs.existsSync(".mumbai-secret")) {
  mumbaiAccounts.push(fs.readFileSync(".mumbai-secret").toString().trim());
}
if (fs.existsSync(".calibration-secret")) {
  calibrationAccounts.push(fs.readFileSync(".calibration-secret").toString().trim());
}
// if (fs.existsSync(".hyperspace-secret")) {
//   hyperspaceAccounts.push(fs.readFileSync(".hyperspace-secret").toString().trim());
// }
if (fs.existsSync(".mainnet-secret")) {
  filecoinAccounts.push(fs.readFileSync(".mainnet-secret").toString().trim());
}

const mumbaiConfig: HttpNetworkUserConfig = {
  url: "https://matic-mumbai.chainstacklabs.com/",
  chainId: 80001,
  accounts: mumbaiAccounts,
};
const calibrationConfig: HttpNetworkUserConfig = {
  url: "https://filecoin-calibration.chainup.net/rpc/v1",
  chainId: 314159,
  accounts: calibrationAccounts,
  timeout: 1000000000
};
// const hyperspaceConfig: HttpNetworkUserConfig = {
//   url: "https://api.hyperspace.node.glif.io/rpc/v1",
//   chainId: 3141,
//   accounts: hyperspaceAccounts,
//   timeout: 1000000000
// };
if (process.env.POLYGON_QUIKNODE_URL) {
  mumbaiConfig.url = process.env.POLYGON_QUIKNODE_URL;
}
const filecoinConfig: HttpNetworkUserConfig = {
  url: "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
  chainId: 314,
  accounts: filecoinAccounts,
  timeout: 1000000000
}
console.log("mumbai cfg:", mumbaiConfig);
console.log("calibrationConfig cfg:", calibrationConfig);
// console.log("hyperspace cfg:", hyperspaceConfig);
console.log("mainnet cfg:", filecoinConfig)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: mumbaiConfig,
    calibration: calibrationConfig,
    // hyperspace: hyperspaceConfig,
    filecoin: filecoinConfig
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
