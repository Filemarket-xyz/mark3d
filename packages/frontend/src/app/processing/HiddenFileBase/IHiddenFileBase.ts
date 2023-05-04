import { FileMarketCrypto } from '../../../../../crypto/src'
import { IBlockchainDataProvider } from '../BlockchainDataProvider'
import { ISeedProvider } from '../SeedProvider'

export interface IHiddenFileBase {
  readonly collectionAddress: ArrayBuffer
  readonly tokenId: number
  readonly crypto: FileMarketCrypto
  readonly seedProvider: ISeedProvider
  readonly blockchainDataProvider: IBlockchainDataProvider
}
