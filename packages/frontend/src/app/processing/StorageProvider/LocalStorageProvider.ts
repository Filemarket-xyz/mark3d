import { IStorageProvider } from './IStorageProvider'

export type StorageData = Record<string, string>

/**
 * Must exist only with unique storageKey.
 * Multiple instances of the LocalStorageProvider with
 * the same storageKey will result into storage inconsistency
 */
export class LocalStorageProvider implements IStorageProvider {
  private readonly data: StorageData

  constructor(private readonly storageKey: string) {
    this.data = this.getData()
  }

  private getData(): StorageData {
    const rawData = localStorage.getItem(this.storageKey)
    if (rawData) {
      return JSON.parse(rawData)
    } else {
      return Object.create(null)
    }
  }

  private setData(data: StorageData) {
    const rawData = JSON.stringify(data)
    localStorage.setItem(this.storageKey, rawData)
  }

  async get(id: string): Promise<string | undefined> {
    return this.data[id]
  }

  async set(id: string, value: string | undefined): Promise<void> {
    if (value) {
      this.data[id] = value
    } else {
      delete this.data[id]
    }
    this.setData(this.data)
  }

  async ids(): Promise<string[]> {
    return Object.keys(this.data)
  }
}
