import { IHiddenFileProcessorFactory } from './IHiddenFileProcessorFactory'
import { HiddenFileBuyer, IHiddenFileBuyer } from '../HiddenFileBuyer'
import { HiddenFileOwner, IHiddenFileOwner } from '../HiddenFileOwner'
import { TokenFullId } from '../types'
import { IHiddenFileBase } from '../HiddenFileBase'
import { ISecureStorage, SecureStorage } from '../SecureStorage'
import { TokenIdStorage } from '../TokenIdStorage/TokenIdStorage'
import { LocalStorageProvider } from '../StorageProvider'
import { StatefulCryptoProvider } from '../StatefulCryptoProvider'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  readonly storage: ISecureStorage
  readonly tokenIdStorage: TokenIdStorage

  constructor() {
    const storageProvider = new LocalStorageProvider('mark3d')
    this.storage = new SecureStorage(storageProvider)
    this.tokenIdStorage = new TokenIdStorage(this.storage)
  }

  async buyerToOwner(buyer: IHiddenFileBuyer): Promise<IHiddenFileOwner> {
    return new HiddenFileOwner(
      buyer.cryptoProvider,
      buyer.surrogateId
    )
  }

  async createBuyer(tokenFullId: TokenFullId): Promise<IHiddenFileBuyer> {
    const surrogateId = await this.tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    return new HiddenFileBuyer(
      new StatefulCryptoProvider(surrogateId, this.storage),
      surrogateId
    )
  }

  async createOwner(tokenFullId: TokenFullId | undefined): Promise<IHiddenFileOwner> {
    const surrogateId = await this.tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    return new HiddenFileOwner(
      new StatefulCryptoProvider(surrogateId, this.storage),
      surrogateId
    )
  }

  async registerTokenFullId(hiddenFileProcessor: IHiddenFileBase, tokenFullId: TokenFullId): Promise<void> {
    await this.tokenIdStorage.setTokenFullId(hiddenFileProcessor.surrogateId, tokenFullId)
  }
}
