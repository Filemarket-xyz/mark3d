/**
 * Is responsible for creating StorageProvider, SecureStorageProvider, TokenIdStorage
 * for every account
 */
import { ISecureStorage } from '../SecureStorage'
import { IStorageProvider } from '../StorageProvider'

export interface AllStorages {
  storageProvider: IStorageProvider
  secureStorage: ISecureStorage
}

export interface IStorageFactory {
  getStorages: (account: string) => Promise<AllStorages>
}
