import { ISeedProviderFactory } from './ISeedProviderFactory'
import { SeedProvider } from '../SeedProvider'
import { utils } from 'ethers/lib.esm'
import { IStorageFactory, storageFactory } from '../StorageFactory'

export class SeedProviderFactory implements ISeedProviderFactory {
  private readonly seedProviders: Record<string, SeedProvider> = Object.create(null)
  private jobs: Record<string, Promise<SeedProvider>> = Object.create(null)

  constructor(private readonly storageFactory: IStorageFactory) {
  }

  private async createSeedProvider(account: string): Promise<SeedProvider> {
    const { storageProvider } = await this.storageFactory.getStorages(account)
    const seedProvider = new SeedProvider(storageProvider, account)
    await seedProvider.init()
    this.seedProviders[account] = seedProvider
    return seedProvider
  }

  async getSeedProvider(account: string): Promise<SeedProvider> {
    account = utils.getAddress(account)
    const seedProvider = this.seedProviders[account]
    if (seedProvider) {
      return seedProvider
    }
    let job = this.jobs[account]
    if (!job) {
      job = this.createSeedProvider(account)
      this.jobs[account] = job
    }
    return await job
  }
}

/**
 * Exists as singleton
 */
export const seedProviderFactory = new SeedProviderFactory(storageFactory)
