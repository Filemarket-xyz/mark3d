export interface IStorageSecurityProvider<Value = Uint8Array> {
  /**
   * Function, that takes care of the credentials and algorithm and encrypts values
   * @param data
   */
  encrypt: (value: Value) => Promise<string>

  /**
   * Function, that takes care of the credentials and algorithm and decrypts values
   * @param encryptedValue
   */
  decrypt: (encryptedValue: string) => Promise<Value>
}
