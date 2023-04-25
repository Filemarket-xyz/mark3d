
import { utils } from 'ethers'

import { fileMarketCrypto } from '../FileMarketCrypto'
import { HiddenFileBuyer } from '../HiddenFileBuyer'
import { HiddenFileOwner } from '../HiddenFileOwner'
import { ISeedProviderFactory, seedProviderFactory } from '../SeedProviderFactory'
import { IHiddenFileProcessorFactory } from './IHiddenFileProcessorFactory'

export class HiddenFileProcessorFactory implements IHiddenFileProcessorFactory {
  private readonly owners: Record<string, HiddenFileOwner> = Object.create(null)
  private readonly buyers: Record<string, HiddenFileBuyer> = Object.create(null)

  constructor(private readonly seedProviderFactory: ISeedProviderFactory) {}

  async getBuyer(account: string): Promise<HiddenFileBuyer> {
    account = utils.getAddress(account)
    const seedProvider = await this.seedProviderFactory.getSeedProvider(account)
    const existing = this.buyers[account]
    if (existing) return existing

    const buyer = new HiddenFileBuyer(seedProvider, fileMarketCrypto)
    this.buyers[account] = buyer

    return buyer
  }

  async getOwner(account: string): Promise<HiddenFileOwner> {
    account = utils.getAddress(account)
    const seedProvider = await this.seedProviderFactory.getSeedProvider(account)
    const existing = this.owners[account]
    if (existing) return existing

    const owner = new HiddenFileOwner(seedProvider, fileMarketCrypto)
    this.owners[account] = owner

    return owner
  }
}

/**
 * Exists as singleton
 */
export const hiddenFileProcessorFactory = new HiddenFileProcessorFactory(seedProviderFactory)
