import { utils } from 'ethers/lib.esm'

import { ISecureStorage, SecureStorage } from '../SecureStorage'
import { IStorageProvider, LocalStorageProvider } from '../StorageProvider'
import { NoopStorageSecurityProvider } from '../StorageSecurityProvider'
import { AllStorages, IStorageFactory } from './IStorageFactory'

export class StorageFactory implements IStorageFactory {
  readonly storageProviders: Record<string, IStorageProvider> = Object.create(null)
  readonly secureStorages: Record<string, ISecureStorage> = Object.create(null)

  private readonly jobs: Record<string, Promise<AllStorages>> = Object.create(null)

  private async createStorages(account: string): Promise<AllStorages> {
    const storageProvider = new LocalStorageProvider(`mark3d/${utils.getAddress(account)}`)
    const secureStorage = new SecureStorage(storageProvider)
    const securityProvider = new NoopStorageSecurityProvider()
    await secureStorage.setSecurityProvider(securityProvider)
    this.storageProviders[account] = storageProvider
    this.secureStorages[account] = secureStorage

    return { storageProvider, secureStorage }
  }

  async getStorages(account: string): Promise<AllStorages> {
    account = utils.getAddress(account)
    const storageProvider = this.storageProviders[account]
    const secureStorage = this.secureStorages[account]
    if (storageProvider && secureStorage) {
      return { storageProvider, secureStorage }
    }
    let job = this.jobs[account]
    if (!job) {
      job = this.createStorages(account)
      this.jobs[account] = job
    }

    return job
  }
}

/**
 * Exists as singleton
 */
export const storageFactory = new StorageFactory()
