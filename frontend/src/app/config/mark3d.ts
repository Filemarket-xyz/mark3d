import accessToken from '../../abi/Mark3dAccessToken'
import exchangeToken from '../../abi/Mark3dExchange'
import collectionToken from '../../abi/Mark3dCollection'
import { chain } from 'wagmi'

export const mark3dConfig = {
  chain: chain.polygonMumbai,
  accessToken: {
    address: '0xdB3A0a1bC30CBdce2DEB9FCc387AD7bb6889f74F',
    abi: accessToken.abi,
    name: accessToken.contractName
  },
  exchangeToken: {
    address: '0x6977F3aDa02857c1Bc2632a38158257D8BE672bb',
    abi: exchangeToken.abi,
    name: exchangeToken.contractName
  },
  collectionToken: {
    // address is created when a new collection is minted
    abi: collectionToken.abi,
    name: collectionToken.contractName
  },
  externalLink: 'https://mark3d.xyz/',
  transferTimeout: 24 * 60 * 60 * 1000
} as const
