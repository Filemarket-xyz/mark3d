export interface ISecureStorage<Value = Uint8Array> {

  readonly id: string

  /**
   * Sets the crypto-callback for encryption and decryption of the stored values.
   * @param encrypt
   * @param decrypt
   */
  setCallbacks: (encrypt: (data: Value) => string, decrypt: (encryptedValue: string) => Value) => Promise<void>

  /**
   * Decrypts and returns a value corresponding to the id.
   * @throws {@link DecryptCallbackError}
   * @throws {@link CallbacksChanging}
   * @param id a string that references the value.
   */
  get: (id: string) => Promise<Value | undefined>

  /**
   * Encrypts and saves the value. If null value is provided, deletes the value.
   *
   * @throws {@link EncryptCallbackError}
   * @throws {@link CallbacksChanging}
   * @param id a string that references the value.
   * @param value
   */
  set: (id: string, value?: Value) => Promise<void>
}
