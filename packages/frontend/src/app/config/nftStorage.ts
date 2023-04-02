import { NFTStorage } from 'nft.storage'

const nftStorageApiKey = import.meta.env.VITE_NFT_STORAGE_KEY

export const nftStorage = new NFTStorage({ token: nftStorageApiKey })
