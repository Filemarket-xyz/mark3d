import { utils } from 'ethers/lib.esm'

import { IHiddenFileBase } from '../HiddenFileBase'
import { HiddenFileBuyer } from '../HiddenFileBuyer'
import { HiddenFileOwner } from '../HiddenFileOwner'
import { IStorageFactory, storageFactory } from '../StorageFactory'
import { TokenFullId } from '../types'
import { IHiddenFileProcessorFactory } from './IHiddenFileProcessorFactory'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  private readonly owners: Record<string, Record<string, HiddenFileOwner>> = Object.create(null)
  private readonly buyers: Record<string, Record<string, HiddenFileBuyer>> = Object.create(null)

  constructor(private readonly storageFactory: IStorageFactory) {}

  async getBuyer(account: string, tokenFullId: TokenFullId): Promise<HiddenFileBuyer> {
    account = utils.getAddress(account)
    const { tokenIdStorage } = await this.storageFactory.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountBuyers = this.buyers[account]
    const existing = accountBuyers?.[surrogateId]
    if (existing) return existing

    const buyer = new HiddenFileBuyer(surrogateId)
    this.buyers[account] = {
      ...accountBuyers,
      [surrogateId]: buyer
    }

    return buyer
  }

  async getOwner(account: string, tokenFullId: TokenFullId | undefined): Promise<HiddenFileOwner> {
    account = utils.getAddress(account)
    const { tokenIdStorage } = await this.storageFactory.getStorages(account)
    const surrogateId = await tokenIdStorage.getSurrogateIdOrCreate(tokenFullId)
    const accountOwners = this.owners[account]
    const existing = accountOwners?.[surrogateId]
    if (existing) return existing

    const owner = new HiddenFileOwner(surrogateId)
    this.owners[account] = {
      ...accountOwners,
      [surrogateId]: owner
    }

    return owner
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
