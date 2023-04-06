import { IStatefulCryptoProvider } from './IStatefulCryptoProvider'
import { ISecureStorage } from '../SecureStorage'
import {
  AESKey,
  CryptoMessage,
  DecryptResult,
  RSAKeyPair,
  RSAPrivateKey,
  RSAPublicKey
} from '../types'
import { decryptAES, encryptAES, genAESKey, decryptRSA, encryptRSA, genRSAKeyPair } from '../utils'
import { NoAESKeyToDecrypt, NoAESKeyToEncrypt, NoRSAPrivateKeyToDecrypt, NoRSAPublicKeyToEncrypt } from './errors'

// prefixes used to prevent collisions in the storage
const storagePrefix = 'crypto'

export class StatefulCryptoProvider implements IStatefulCryptoProvider {
  constructor(
    public readonly id: string,
    public readonly storage: ISecureStorage
  ) {
  }

  private get AESKeyId() {
    return `${storagePrefix}/${this.id}/AES`
  }

  private get RSAPrivateKeyId() {
    return `${storagePrefix}/${this.id}/RSA/Private`
  }

  private get RSAPublicKeyId() {
    return `${storagePrefix}/${this.id}/RSA/Public`
  }

  async decryptAES(message: CryptoMessage): Promise<DecryptResult> {
    const key = await this.getAESKey()
    if (!key) {
      throw new NoAESKeyToDecrypt(this.id)
    }
    return decryptAES(message, key)
  }

  async decryptRSA(message: CryptoMessage): Promise<DecryptResult> {
    const key = await this.getRSAPrivateKey()
    if (!key) {
      throw new NoRSAPrivateKeyToDecrypt(this.id)
    }
    return await decryptRSA(message, key)
  }

  async encryptAES(message: CryptoMessage): Promise<CryptoMessage> {
    const key = await this.getAESKey()
    if (!key) {
      throw new NoAESKeyToEncrypt(this.id)
    }
    return encryptAES(message, key)
  }

  async encryptRSA(message: CryptoMessage): Promise<CryptoMessage> {
    const key = await this.getRSAPublicKey()
    if (!key) {
      throw new NoRSAPublicKeyToEncrypt(this.id)
    }
    return await encryptRSA(message, key)
  }

  async genAESKey(): Promise<AESKey> {
    const key = await genAESKey()
    await this.setAESKey(key)
    return key
  }

  async genRSAKeyPair(): Promise<RSAKeyPair> {
    const pair = await genRSAKeyPair()
    await this.setRSAKeyPair(pair)
    return pair
  }

  async getAESKey(): Promise<AESKey | undefined> {
    return await this.storage.get(this.AESKeyId)
  }

  async getRSAPrivateKey(): Promise<RSAPrivateKey | undefined> {
    return await this.storage.get(this.RSAPrivateKeyId)
  }

  async getRSAPublicKey(): Promise<RSAPublicKey | undefined> {
    return await this.storage.get(this.RSAPublicKeyId)
  }

  async setAESKey(key: AESKey): Promise<void> {
    return await this.storage.set(this.AESKeyId, key)
  }

  private async setRSAKeyPair(keyPair: RSAKeyPair): Promise<void> {
    await this.storage.set(this.RSAPrivateKeyId, keyPair.priv)
    await this.storage.set(this.RSAPublicKeyId, keyPair.pub)
  }
}
