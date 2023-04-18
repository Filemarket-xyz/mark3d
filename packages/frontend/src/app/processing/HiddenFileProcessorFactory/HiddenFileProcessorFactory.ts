import { IHiddenFileProcessorFactory } from './IHiddenFileProcessorFactory'
import { HiddenFileBuyer, IHiddenFileBuyer } from '../HiddenFileBuyer'
import { HiddenFileOwner } from '../HiddenFileOwner'
import { TokenFullId } from '../types'
import { IHiddenFileBase } from '../HiddenFileBase'
import { StatefulCryptoProvider } from '../StatefulCryptoProvider'
import { utils } from 'ethers/lib.esm'
import { IStorageFactory, storageFactory } from '../StorageFactory'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  private readonly owners: Record<string, Record<string, HiddenFileOwner>> = Object.create(null)
  private readonly buyers: Record<string, Record<string, HiddenFileBuyer>> = Object.create(null)

  constructor(private readonly storageFactory: IStorageFactory) {
  }

  async buyerToOwner(buyer: IHiddenFileBuyer): Promise<HiddenFileOwner> {
    return new HiddenFileOwner(
      buyer.cryptoProvider,
      buyer.surrogateId
    )
  }

  async getBuyer(account: string, tokenFullId: TokenFullId): Promise<HiddenFileBuyer> {
    account = utils.getAddress(account)
    const { tokenIdStorage, secureStorage } = await this.storageFactory.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountBuyers = this.buyers[account]
    const existing = accountBuyers?.[surrogateId]
    if (existing) {
      return existing
    } else {
      const buyer = new HiddenFileBuyer(
        new StatefulCryptoProvider(surrogateId, secureStorage),
        surrogateId
      )
      this.buyers[account] = {
        ...accountBuyers,
        [surrogateId]: buyer
      }
      return buyer
    }
  }

  async getOwner(account: string, tokenFullId: TokenFullId | undefined): Promise<HiddenFileOwner> {
    account = utils.getAddress(account)
    const { tokenIdStorage, secureStorage } = await this.storageFactory.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountOwners = this.owners[account]
    const existing = accountOwners?.[surrogateId]
    if (existing) {
      return existing
    } else {
      const owner = new HiddenFileOwner(
        new StatefulCryptoProvider(surrogateId, secureStorage),
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
    const { tokenIdStorage } = await this.storageFactory.getStorages(account)
    await tokenIdStorage.setTokenFullId(hiddenFileProcessor.surrogateId, tokenFullId)
  }
}

/**
 * Exists as singleton
 */
export const hiddenFileProcessorFactory = new HiddenFileProcessorFactory(storageFactory)
