import { IStorageSecurityProvider } from './IStorageSecurityProvider'

export class NoopStorageSecurityProvider implements IStorageSecurityProvider<Uint8Array> {
  private readonly encoding = 'base64'
  async encrypt(value: Uint8Array): Promise<string> {
    return Buffer.from(value).toString(this.encoding)
  }

  async decrypt(encryptedValue: string): Promise<Uint8Array> {
    return Buffer.from(encryptedValue, this.encoding)
  }
}
