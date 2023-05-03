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

const mark3dChain = filecoinHyperspace

export const mark3dConfig = {
  chain: mark3dChain,
  // Hardcode high gas price in testnet to prevent "transaction underpriced" error
  gasPrice: mark3dChain.testnet ? utils.parseUnits('30', 'gwei') : undefined,
  accessToken: {
    address: '0xE47AAb76dF0A9CD8d142753198AcaaB475Bf2A21',
    abi: accessToken.abi,
    name: accessToken.contractName
  },
  exchangeToken: {
    address: '0x387EE91bA3f6bA73Ef323DeFab14FC2aa80db923',
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
