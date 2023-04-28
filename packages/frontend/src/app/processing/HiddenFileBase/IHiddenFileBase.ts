import { FileMarketCrypto } from '../../../../../crypto/src'
import { ISeedProvider } from '../SeedProvider'

export interface IHiddenFileBase {
  readonly crypto: FileMarketCrypto
  readonly seedProvider: ISeedProvider
}
