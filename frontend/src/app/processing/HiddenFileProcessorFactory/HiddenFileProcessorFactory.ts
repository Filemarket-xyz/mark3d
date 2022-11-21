import { IHiddenFileProcessorFactory } from './IHiddenFileProcessorFactory'
import { HiddenFileBuyer, IHiddenFileBuyer } from '../HiddenFileBuyer'
import { HiddenFileOwner, IHiddenFileOwner } from '../HiddenFileOwner'
import { TokenFullId } from '../types'
import { IHiddenFileBase } from '../HiddenFileBase'
import { ISecureStorage, SecureStorage } from '../SecureStorage'
import { TokenIdStorage } from '../TokenIdStorage'
import { LocalStorageProvider } from '../StorageProvider'
import { StatefulCryptoProvider } from '../StatefulCryptoProvider'
import { NoopStorageSecurityProvider } from '../StorageSecurityProvider'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  readonly storage: ISecureStorage
  readonly tokenIdStorage: TokenIdStorage

  private readonly owners: Record<string, IHiddenFileOwner> = Object.create(null)
  private readonly buyers: Record<string, IHiddenFileBuyer> = Object.create(null)

  constructor() {
    const storageProvider = new LocalStorageProvider('mark3d')
    this.storage = new SecureStorage(storageProvider)
    this.tokenIdStorage = new TokenIdStorage(this.storage)
    void this.setStorageSecurityProvider()
  }

  private async setStorageSecurityProvider() {
    const securityProvider = new NoopStorageSecurityProvider()
    await this.storage.setSecurityProvider(securityProvider)
  }

  async buyerToOwner(buyer: IHiddenFileBuyer): Promise<IHiddenFileOwner> {
    return new HiddenFileOwner(
      buyer.cryptoProvider,
      buyer.surrogateId
    )
  }

  async getBuyer(tokenFullId: TokenFullId): Promise<IHiddenFileBuyer> {
    const surrogateId = await this.tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const existing = this.buyers[surrogateId]
    if (existing) {
      return existing
    } else {
      const buyer = new HiddenFileBuyer(
        new StatefulCryptoProvider(surrogateId, this.storage),
        surrogateId
      )
      this.buyers[surrogateId] = buyer
      return buyer
    }
  }

  async getOwner(tokenFullId: TokenFullId | undefined): Promise<IHiddenFileOwner> {
    const surrogateId = await this.tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const existing = this.owners[surrogateId]
    if (existing) {
      return existing
    } else {
      const owner = new HiddenFileOwner(
        new StatefulCryptoProvider(surrogateId, this.storage),
        surrogateId
      )
      this.owners[surrogateId] = owner
      return owner
    }
  }

  async registerTokenFullId(hiddenFileProcessor: IHiddenFileBase, tokenFullId: TokenFullId): Promise<void> {
    await this.tokenIdStorage.setTokenFullId(hiddenFileProcessor.surrogateId, tokenFullId)
  }
}
