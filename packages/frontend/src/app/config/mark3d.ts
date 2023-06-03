import { Chain } from '@web3modal/ethereum'
import { utils } from 'ethers'

import collectionToken from '../../abi/FilemarketCollectionV2'
import exchangeToken from '../../abi/FilemarketExchangeV2'
import accessToken from '../../abi/Mark3dAccessTokenV2'

const filecoinCalibration: Chain = {
  id: 314159,
  name: 'Filecoin - Calibration testnet',
  network: 'Calibration',
  nativeCurrency: {
    name: 'TFIL',
    symbol: 'TFIL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://filecoin-calibration.chainup.net/rpc/v1'],
    },
    public: {
      http: ['https://api.calibration.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Calibration filscan',
      url: 'https://calibration.filscan.io',
    },
  },

}

const filecoinMainnet: Chain = {
  id: 314,
  name: 'FVM - Mainnet',
  network: 'Filecoin',
  nativeCurrency: {
    name: 'FIL',
    symbol: 'FIL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.ankr.com/filecoin', 'https://filecoin.chainup.net/rpc/v1', 'https://api.node.glif.io'],
    },
    public: {
      http: ['https://rpc.ankr.com/filecoin', 'https://filecoin.chainup.net/rpc/v1', 'https://api.node.glif.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'FVM Mainnet explorer',
      url: 'https://filfox.info/en',
    },
  },
}

const isMainnet = import.meta.env.VITE_IS_MAINNET

const mark3dChain = isMainnet ? filecoinMainnet : filecoinCalibration

const accessTokenAddress = isMainnet ? '0x2905A2Ad979ABfeb50C12F042Ab2b2A1359a47E4' : '0xC3F07F620715Fec92db305f718C7FA10C708Bf7A'

const exchangeTokenAddress = isMainnet ? '0xFDD2eF676C5c5dE3476FFCf6EECa86E4cb8499d4' : '0xc7477BC829f77A2eE5d6AFbEfefcA0c3E87Bd392'

export const mark3dConfig = {
  chain: mark3dChain,
  // Hardcode high gas price in testnet to prevent "transaction underpriced" error
  gasPrice: mark3dChain.testnet ? utils.parseUnits('30', 'gwei') : undefined,
  accessToken: {
    address: accessTokenAddress,
    abi: accessToken.abi,
    name: accessToken.contractName,
  },
  exchangeToken: {
    address: exchangeTokenAddress,
    abi: exchangeToken.abi,
    name: exchangeToken.contractName,
  },
  collectionToken: {
    // address is created when a new collection is minted
    abi: collectionToken.abi,
    name: collectionToken.contractName,
  },
  externalLink: 'https://filemarket.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000,
} as const
