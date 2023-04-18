import { IStorageFactory } from './IStorageFactory'
import { utils } from 'ethers/lib.esm'
import { IStorageProvider, LocalStorageProvider } from '../StorageProvider'
import { ISecureStorage, SecureStorage } from '../SecureStorage'
import { TokenIdStorage } from '../TokenIdStorage'
import { NoopStorageSecurityProvider } from '../StorageSecurityProvider'

export class StorageFactory implements IStorageFactory {
  readonly storageProviders: Record<string, IStorageProvider> = Object.create(null)
  readonly secureStorages: Record<string, ISecureStorage> = Object.create(null)
  readonly tokenIdStorages: Record<string, TokenIdStorage> = Object.create(null)

  async getStorages(account: string) {
    account = utils.getAddress(account)
    let storageProvider = this.storageProviders[account]
    let secureStorage = this.secureStorages[account]
    let tokenIdStorage = this.tokenIdStorages[account]
    if (!storageProvider || !secureStorage || !tokenIdStorage) {
      storageProvider = new LocalStorageProvider(`mark3d/${utils.getAddress(account)}`)
      secureStorage = new SecureStorage(storageProvider)
      tokenIdStorage = new TokenIdStorage(secureStorage)
      const securityProvider = new NoopStorageSecurityProvider()
      await secureStorage.setSecurityProvider(securityProvider)
      this.storageProviders[account] = storageProvider
      this.secureStorages[account] = secureStorage
      this.tokenIdStorages[account] = tokenIdStorage
    }
    return { storageProvider, secureStorage, tokenIdStorage }
  }
}

/**
 * Exists as singleton
 */
export const storageFactory = new StorageFactory()
