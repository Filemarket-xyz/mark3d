import { IStorageSecurityProvider } from './IStorageSecurityProvider'

/**
 * For now no encryption, but in the future it will be included.
 */
export class NoopStorageSecurityProvider implements IStorageSecurityProvider {
  async encrypt(value: string): Promise<string> {
    return value
  }

  async decrypt(encryptedValue: string): Promise<string> {
    return encryptedValue
  }
}
