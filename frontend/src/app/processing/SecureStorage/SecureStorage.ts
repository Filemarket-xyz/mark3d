import { ISecureStorage } from './ISecureStorage'
import { wrappedCall } from '../../utils/error/wrappedCall'
import { IStorageSecurityProvider } from '../StorageSecurityProvider'
import { IStorageProvider, StorageData } from '../StorageProvider'
import { DecryptError, EncryptError, LoadError, UploadError, UploadSingleError } from './errors'
import { arrayToRecord } from '../../utils/structs/arrayToRecord'

const encrypt = async (provider: IStorageSecurityProvider | undefined, data: Uint8Array): Promise<string> => {
  return await wrappedCall(EncryptError, provider?.encrypt, data)
}

const decrypt = async (provider: IStorageSecurityProvider | undefined, encryptedValue: string): Promise<Uint8Array> => {
  return await wrappedCall(DecryptError, provider?.decrypt, encryptedValue)
}

export class SecureStorage implements ISecureStorage<Uint8Array> {
  private securityProvider?: IStorageSecurityProvider
  securityProviderChanging = false

  data?: StorageData

  constructor(
    public readonly storageProvider: IStorageProvider
  ) {
    this.uploadSingle = this.storageProvider.uploadSingle
      ? async (id: string, value?: string): Promise<void> =>
        await wrappedCall(UploadSingleError, this.storageProvider.uploadSingle, id, value)
      : undefined
  }

  private async upload(data: StorageData): Promise<void> {
    return await wrappedCall(UploadError, this.storageProvider.upload, data)
  }

  // initialized in the constructor
  private readonly uploadSingle?: (id: string, value?: string) => Promise<void>

  private async load(): Promise<StorageData> {
    return await wrappedCall(LoadError, this.storageProvider.load)
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
              await encrypt(this.securityProvider, await decrypt(this.securityProvider, encryptedValue))
            ])
        )
        await this.setData(arrayToRecord(encryptedWithNewProviderData))
      }
    }
    this.securityProvider = securityProvider
  }

  private async ensureData(): Promise<void> {
    if (!this.data) {
      this.data = await this.load()
    }
  }

  private async setData(data: StorageData): Promise<void> {
    await this.upload(data)
    this.data = data
  }

  async get(id: string): Promise<Uint8Array | undefined> {
    await this.ensureData()
    const encryptedValue = this.data?.[id]
    if (!encryptedValue) {
      return undefined
    }
    return await decrypt(this.securityProvider, encryptedValue)
  }

  async set(id: string, value?: Uint8Array): Promise<void> {
    const encryptedValue = value && await encrypt(this.securityProvider, value)
    if (this.uploadSingle) {
      await this.uploadSingle(id, encryptedValue)
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
