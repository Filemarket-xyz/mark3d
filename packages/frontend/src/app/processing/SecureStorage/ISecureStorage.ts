import { IStorageSecurityProvider } from '../StorageSecurityProvider'
import { IStorageProvider } from '../StorageProvider'

export interface ISecureStorage<Value = string> {

  readonly storageProvider: IStorageProvider

  /**
   * Indicates whether promise returned by setSecurityProvider is executing.
   */
  securityProviderChanging: boolean

  /**
   * Sets the crypto functions for encryption and decryption of the stored values.
   * When called second time, will decrypt all values with an old security provider and encrypt with the new one.
   * @param encrypt
   * @param decrypt
   */
  setSecurityProvider: (securityProvider: IStorageSecurityProvider<Value>) => Promise<void>

  /**
   * Decrypts and returns a value corresponding to the id.
   * @throws {@link CallbacksChangingError}
   * @param id a string that references the value.
   */
  get: (id: string) => Promise<Value | undefined>

  /**
   * Encrypts and saves the value. If null value is provided, deletes the value.
   *
   * @throws {@link CallbacksChangingError}
   * @param id a string that references the value.
   * @param value
   */
  set: (id: string, value: Value | undefined) => Promise<void>
}
