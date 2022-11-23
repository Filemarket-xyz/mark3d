import accessToken from '../../abi/Mark3dAccessToken'
import exchangeToken from '../../abi/Mark3dExchange'
import collectionToken from '../../abi/Mark3dCollection'
import { chain } from 'wagmi'

export const mark3dConfig = {
  chain: chain.polygonMumbai,
  accessToken: {
    address: '0xf18A98B45445622e43945fc6e321eE6D553391a0',
    abi: accessToken.abi,
    name: accessToken.contractName
  },
  exchangeToken: {
    address: '0x087f62bf61378BEaCB8704C6C3F0e60130048638',
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
