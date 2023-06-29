import { Chain } from '@web3modal/ethereum'
import { utils } from 'ethers'
import { parseUnits } from 'ethers/lib.esm/utils'

import fileBunniesCollection from '../../abi/FileBunniesCollection'
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
      http: ['https://rpc.ankr.com/filecoin_testnet'],
    },
    public: {
      http: ['https://filecoin-calibration.chainup.net/rpc/v1'],
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

export const fee = +import.meta.env.VITE_MARKETPLACE_FEE
const isMainnet = import.meta.env.VITE_IS_MAINNET

const mark3dChain = isMainnet ? filecoinMainnet : filecoinCalibration

const accessTokenAddress = isMainnet ? '0xdcbF452fEA133e28759F050C9BDD827C805B3030' : '0xC3F07F620715Fec92db305f718C7FA10C708Bf7A'
const exchangeTokenAddress = isMainnet ? '0x2f255f048c1510485bd3F7D65520EDFB9EbC9362' : '0x2301D80E8A7e4Cf59a349ffC20A51367cb27A4fc'

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
  fileBunniesCollectionToken: {
    abi: fileBunniesCollection.abi,
    name: fileBunniesCollection.contractName,
    address: '0xBc3a4453Dd52D3820EaB1498c4673C694c5c6F09',
  },
  externalLink: 'https://filemarket.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000,
  fileBunniesPrice: isMainnet ? parseUnits('12.0', 'ether') : parseUnits('0.01', 'ether'),
} as const
