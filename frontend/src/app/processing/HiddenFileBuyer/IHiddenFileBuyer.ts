import { IHiddenFileBase } from '../HiddenFileBase/IHiddenFileBase'
import { CryptoMessage, DecryptResult, RSAPrivateKey, RSAPublicKey } from '../types'

export interface IHiddenFileBuyer extends IHiddenFileBase {

  /**
   * Generates and saves RSA key pair
   */
  initBuy: () => Promise<RSAPublicKey>

  /**
   * Decrypts AES key for file with saved RSA key pair.
   * @returns {@link DecryptResult} DecryptResult.ok is true if file was successfully decrypted with provided key,
   * false otherwise. DecryptResult.result will contain decrypted file.
   */
  saveFileAESKey: (encryptedFile: CryptoMessage) => Promise<DecryptResult>

  /**
   * Used to report fraud if {@link saveFileAESKey} failed.
   */
  revealFraudReportRSAPrivateKey: () => Promise<RSAPrivateKey>
}
