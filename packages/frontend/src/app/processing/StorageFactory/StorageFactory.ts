import { AllStorages, IStorageFactory } from './IStorageFactory'
import { utils } from 'ethers/lib.esm'
import { IStorageProvider, LocalStorageProvider } from '../StorageProvider'
import { ISecureStorage, SecureStorage } from '../SecureStorage'
import { TokenIdStorage } from '../TokenIdStorage'
import { NoopStorageSecurityProvider } from '../StorageSecurityProvider'

export class StorageFactory implements IStorageFactory {
  readonly storageProviders: Record<string, IStorageProvider> = Object.create(null)
  readonly secureStorages: Record<string, ISecureStorage> = Object.create(null)
  readonly tokenIdStorages: Record<string, TokenIdStorage> = Object.create(null)

  private readonly jobs: Record<string, Promise<AllStorages>> = Object.create(null)

  private async createStorages(account: string): Promise<AllStorages> {
    const storageProvider = new LocalStorageProvider(`mark3d/${utils.getAddress(account)}`)
    const secureStorage = new SecureStorage(storageProvider)
    const tokenIdStorage = new TokenIdStorage(secureStorage)
    const securityProvider = new NoopStorageSecurityProvider()
    await secureStorage.setSecurityProvider(securityProvider)
    this.storageProviders[account] = storageProvider
    this.secureStorages[account] = secureStorage
    this.tokenIdStorages[account] = tokenIdStorage
    return { storageProvider, secureStorage, tokenIdStorage }
  }

  async getStorages(account: string): Promise<AllStorages> {
    account = utils.getAddress(account)
    const storageProvider = this.storageProviders[account]
    const secureStorage = this.secureStorages[account]
    const tokenIdStorage = this.tokenIdStorages[account]
    if (storageProvider && secureStorage && tokenIdStorage) {
      return { storageProvider, secureStorage, tokenIdStorage }
    }
    let job = this.jobs[account]
    if (!job) {
      job = this.createStorages(account)
      this.jobs[account] = job
    }
    return await job
  }
}

/**
 * Exists as singleton
 */
export const storageFactory = new StorageFactory()
