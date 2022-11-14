import { AESKey, CryptoMessage, DecryptResult, RSAKeyPair, RSAPrivateKey, RSAPublicKey } from '../types'
import { ISecureStorage } from '../SecureStorage'

export interface ICryptoProvider {
  readonly id: string
  readonly storage: ISecureStorage

  /**
   * Generates and saves AES key corresponding to the id.
   */
  genAESKey: () => Promise<AESKey>

  /**
   * Returns existing AES key corresponding to the id.
   */
  getAESKey: () => Promise<AESKey | undefined>

  /**
   * Sets and saves AES key corresponding to the id. The key will then used during encryption/decryption
   */
  setAESKey: () => Promise<void>

  /**
   * Generates and saves RSA key pair corresponding to the id.
   */
  genRSAKeyPair: () => Promise<RSAKeyPair>

  /**
   * Returns existing RSA public key corresponding to the id.
   */
  getRSAPublicKey: () => Promise<RSAPublicKey | undefined>

  /**
   * Generates or returns existing RSA private key corresponding to the id.
   */
  getRSAPrivateKey: () => Promise<RSAPrivateKey | undefined>

  /**
   * Encrypts the message with AES using key corresponding to the id.
   * @throws {@link NoAESKeyToEncrypt}
   * @param message
   */
  encryptAES: (message: CryptoMessage) => Promise<CryptoMessage>
  /**
   * Decrypts the message with AES using key corresponding to the id.
   * @throws {@link NoAESKeyToDecrypt}
   * @param message
   */
  decryptAES: (message: CryptoMessage) => Promise<DecryptResult>

  /**
   * Encrypts the message with RSA using key corresponding to the id.
   * @throws {@link NoRSAPublicKeyToEncrypt}
   * @param message
   */
  encryptRSA: (message: CryptoMessage) => Promise<CryptoMessage>

  /**
   * Decrypts the message with RSA using key corresponding to the id.
   * @throws {@link NoRSAPrivateKeyToDecrypt}
   * @param message
   */
  decryptRSA: (message: CryptoMessage) => Promise<DecryptResult>
}
