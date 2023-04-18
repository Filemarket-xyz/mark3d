/**
 * Is responsible for creating StorageProvider, SecureStorageProvider, TokenIdStorage
 * for every account
 */
import { IStorageProvider } from '../StorageProvider'
import { ISecureStorage } from '../SecureStorage'
import { ITokenIdStorage } from '../TokenIdStorage'

export interface IStorageFactory {
  getStorages: (account: string) => Promise<{
    storageProvider: IStorageProvider
    secureStorage: ISecureStorage
    tokenIdStorage: ITokenIdStorage
  }>
}
