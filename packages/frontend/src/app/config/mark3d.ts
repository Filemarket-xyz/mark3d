import { Chain } from '@web3modal/ethereum'
import { utils } from 'ethers'

import accessToken from '../../abi/Mark3dAccessToken'
import collectionToken from '../../abi/Mark3dCollection'
import exchangeToken from '../../abi/Mark3dExchange'

const filecoinHyperspace: Chain = {
  id: 3141,
  name: 'Filecoin - Hyperspace testnet',
  network: 'Hyperspace',
  nativeCurrency: {
    name: 'TFIL',
    symbol: 'TFIL',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/filecoin_testnet', 'https://api.hyperspace.node.glif.io/rpc/v1', 'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1']
    },
    public: {
      http: ['https://rpc.ankr.com/filecoin_testnet', 'https://api.hyperspace.node.glif.io/rpc/v1', 'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1']
    }
  },
  blockExplorers: {
    default: {
      name: 'Hyperspace explorer',
      url: 'https://hyperspace.filfox.info/en'
    }
  }

}

const filecoinMainnet: Chain = {
  id: 314,
  name: 'FVM - Mainnet',
  network: 'Filecoin',
  nativeCurrency: {
    name: 'FIL',
    symbol: 'FIL',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://filecoin-mainnet.chainstacklabs.com/rpc/v1', 'https://rpc.ankr.com/filecoin', 'https://filecoin.chainup.net/rpc/v1', 'https://api.node.glif.io']
    },
    public: {
      http: ['https://filecoin-mainnet.chainstacklabs.com/rpc/v1', 'https://rpc.ankr.com/filecoin', 'https://filecoin.chainup.net/rpc/v1', 'https://api.node.glif.io']
    }
  },
  blockExplorers: {
    default: {
      name: 'FVM Mainnet explorer',
      url: 'https://filfox.info/en'
    }
  }
}

const isMainnet = import.meta.env.VITE_IS_MAINNET

const mark3dChain = isMainnet ? filecoinMainnet : filecoinHyperspace

const accessTokenAddress = isMainnet ? '0x2905A2Ad979ABfeb50C12F042Ab2b2A1359a47E4' : '0xE47AAb76dF0A9CD8d142753198AcaaB475Bf2A21'

const exchangeTokenAddress = isMainnet ? '0xFDD2eF676C5c5dE3476FFCf6EECa86E4cb8499d4' : '0x387EE91bA3f6bA73Ef323DeFab14FC2aa80db923'

export const mark3dConfig = {
  chain: mark3dChain,
  // Hardcode high gas price in testnet to prevent "transaction underpriced" error
  gasPrice: mark3dChain.testnet ? utils.parseUnits('30', 'gwei') : undefined,
  accessToken: {
    address: accessTokenAddress,
    abi: accessToken.abi,
    name: accessToken.contractName
  },
  exchangeToken: {
    address: exchangeTokenAddress,
    abi: exchangeToken.abi,
    name: exchangeToken.contractName
  },
  collectionToken: {
    // address is created when a new collection is minted
    abi: collectionToken.abi,
    name: collectionToken.contractName
  },
  externalLink: 'https://filemarket.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000
} as const
