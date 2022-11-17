import { IStorageProvider, StorageData } from './IStorageProvider'

export class LocalStorageProvider implements IStorageProvider {
  constructor(private readonly storageKey: string) {
  }

  async load(): Promise<StorageData> {
    const rawData = localStorage.getItem(this.storageKey)
    if (rawData) {
      return JSON.parse(rawData)
    } else {
      return Object.create(null)
    }
  }

  async upload(data: StorageData): Promise<void> {
    const rawData = JSON.stringify(data)
    localStorage.setItem(this.storageKey, rawData)
  }
}
