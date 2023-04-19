/**
 * Assumed that the data is stored in a key-value format.
 *
 * If the data can oly be treated as a whole chunk, this
 * provider should be in charge of handling chunk
 * download and upload.
 *
 */
export interface IStorageProvider {

  /**
   * Sets a single value to correspond id
   * @param id
   * @param value
   */
  set: (id: string, value: string | undefined) => Promise<void>

  /**
   * Gets a single value by key
   * @param id
   */
  get: (id: string) => Promise<string | undefined>

  /**
   * Returns all keys available
   */
  ids: () => Promise<string[]>
}
