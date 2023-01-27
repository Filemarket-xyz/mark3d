import accessToken from '../../abi/Mark3dAccessToken'
import exchangeToken from '../../abi/Mark3dExchange'
import collectionToken from '../../abi/Mark3dCollection'
import { utils } from 'ethers'
import { Chain } from '@web3modal/ethereum'

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
      http: ['https://api.hyperspace.node.glif.io/rpc/v1', 'https://api.hyperspace.node.glif.io/rpc/v1']
    }
  },
  blockExplorers: {
    default: {
      name: 'Hyperspace explorer',
      url: 'https://explorer.glif.io/message/?network=hyperspace'
    }
  }

}

const mark3dChain = filecoinHyperspace

export const mark3dConfig = {
  chain: mark3dChain,
  // Hardcode high gas price in testnet to prevent "transaction underpriced" error
  gasPrice: mark3dChain.testnet ? utils.parseUnits('30', 'gwei') : undefined,
  accessToken: {
    address: '0xDF5a6aBa1D6a68c4e933127829dddBF106f45075',
    abi: accessToken.abi,
    name: accessToken.contractName
  },
  exchangeToken: {
    address: '0x1358f538b52D60c8012091adA98c8604F81e5556',
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
