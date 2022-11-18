import { ISecureStorage } from './ISecureStorage'
import { ensureCall } from '../../utils/error'
import { IStorageSecurityProvider } from '../StorageSecurityProvider'
import { IStorageProvider, StorageData } from '../StorageProvider'
import { arrayToRecord } from '../../utils/structs'
import { CallbacksChangingError } from './errors'

const encrypt = async (provider: IStorageSecurityProvider | undefined, data: string): Promise<string> => {
  return await ensureCall('StorageSecurityProvider.encrypt', provider?.encrypt, data)
}

const decrypt = async (provider: IStorageSecurityProvider | undefined, encryptedValue: string): Promise<string> => {
  return await ensureCall('StorageSecurityProvider.decrypt', provider?.decrypt, encryptedValue)
}

export class SecureStorage implements ISecureStorage {
  private securityProvider?: IStorageSecurityProvider
  securityProviderChanging = false

  data?: StorageData

  constructor(
    public readonly storageProvider: IStorageProvider
  ) {
  }

  async setSecurityProvider(securityProvider: IStorageSecurityProvider): Promise<void> {
    if (this.securityProvider) {
      await this.ensureData()
      if (this.data) {
        const encryptedWithNewProviderData: Array<[string, string]> = await Promise.all(
          Object
            .entries(this.data)
            .map(async ([id, encryptedValue]) => [
              id,
              await encrypt(securityProvider, await decrypt(this.securityProvider, encryptedValue))
            ])
        )
        await this.setData(arrayToRecord(encryptedWithNewProviderData))
      }
    }
    this.securityProvider = securityProvider
  }

  private async ensureData(): Promise<void> {
    if (!this.data) {
      this.data = await this.storageProvider.load()
    }
  }

  private async setData(data: StorageData): Promise<void> {
    await this.storageProvider.upload(data)
    this.data = data
  }

  async get(id: string): Promise<string | undefined> {
    if (this.securityProviderChanging) {
      throw new CallbacksChangingError()
    }
    await this.ensureData()
    const encryptedValue = this.data?.[id]
    if (!encryptedValue) {
      return undefined
    }
    return await decrypt(this.securityProvider, encryptedValue)
  }

  async set(id: string, value: string | undefined): Promise<void> {
    if (this.securityProviderChanging) {
      throw new CallbacksChangingError()
    }
    const encryptedValue = value && await encrypt(this.securityProvider, value)
    if (this.storageProvider.uploadSingle) {
      await this.storageProvider.uploadSingle(id, encryptedValue)
    } else {
      await this.ensureData()
      const data = { ...this.data }
      if (encryptedValue) {
        data[id] = encryptedValue
      } else {
        delete data[id]
      }
      await this.setData(data)
    }
  }
}
