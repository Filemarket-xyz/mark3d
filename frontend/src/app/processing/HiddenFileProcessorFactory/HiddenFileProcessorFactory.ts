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
import { utils } from 'ethers/lib.esm'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  readonly storages: Record<string, ISecureStorage> = Object.create(null)
  readonly tokenIdStorages: Record<string, TokenIdStorage> = Object.create(null)

  private readonly owners: Record<string, Record<string, IHiddenFileOwner>> = Object.create(null)
  private readonly buyers: Record<string, Record<string, IHiddenFileBuyer>> = Object.create(null)

  private async getStorages(account: string) {
    account = utils.getAddress(account)
    let storage = this.storages[account]
    let tokenIdStorage = this.tokenIdStorages[account]
    if (!storage || !tokenIdStorage) {
      const storageProvider = new LocalStorageProvider(`mark3d/${utils.getAddress(account)}`)
      storage = new SecureStorage(storageProvider)
      tokenIdStorage = new TokenIdStorage(storage)
      const securityProvider = new NoopStorageSecurityProvider()
      await storage.setSecurityProvider(securityProvider)
      this.storages[account] = storage
      this.tokenIdStorages[account] = tokenIdStorage
    }
    return { storage, tokenIdStorage }
  }

  async buyerToOwner(buyer: IHiddenFileBuyer): Promise<IHiddenFileOwner> {
    return new HiddenFileOwner(
      buyer.cryptoProvider,
      buyer.surrogateId
    )
  }

  async getBuyer(account: string, tokenFullId: TokenFullId): Promise<IHiddenFileBuyer> {
    account = utils.getAddress(account)
    const { tokenIdStorage, storage } = await this.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountBuyers = this.buyers[account]
    const existing = accountBuyers?.[surrogateId]
    if (existing) {
      return existing
    } else {
      const buyer = new HiddenFileBuyer(
        new StatefulCryptoProvider(surrogateId, storage),
        surrogateId
      )
      this.buyers[account] = {
        ...accountBuyers,
        [surrogateId]: buyer
      }
      return buyer
    }
  }

  async getOwner(account: string, tokenFullId: TokenFullId | undefined): Promise<IHiddenFileOwner> {
    account = utils.getAddress(account)
    const { tokenIdStorage, storage } = await this.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountOwners = this.owners[account]
    const existing = accountOwners?.[surrogateId]
    if (existing) {
      return existing
    } else {
      const owner = new HiddenFileOwner(
        new StatefulCryptoProvider(surrogateId, storage),
        surrogateId
      )
      this.owners[account] = {
        ...accountOwners,
        [surrogateId]: owner
      }
      return owner
    }
  }

  async registerTokenFullId(
    account: string, hiddenFileProcessor: IHiddenFileBase, tokenFullId: TokenFullId
  ): Promise<void> {
    const { tokenIdStorage } = await this.getStorages(account)
    await tokenIdStorage.setTokenFullId(hiddenFileProcessor.surrogateId, tokenFullId)
  }
}
