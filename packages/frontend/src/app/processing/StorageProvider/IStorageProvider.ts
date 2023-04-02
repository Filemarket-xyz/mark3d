export type StorageData = Record<string, string>

export interface IStorageProvider {
  /**
   * Loads all data from the permanent storage
   */
  load: () => Promise<StorageData>

  /**
   * Uploads all data to the permanent storage
   * @param data
   */
  upload: (data: StorageData) => Promise<void>

  /**
   * Optimisation. If available, will not upload all data when updating only a single value needed.
   * When value is null, the record is deleted.
   * @param id
   * @param value
   */
  uploadSingle?: (id: string, value?: string) => Promise<void>
}
