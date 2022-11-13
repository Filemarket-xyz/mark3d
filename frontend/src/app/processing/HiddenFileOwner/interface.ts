import { CryptoMessage, RSAPublicKey } from '../types'
import { IHiddenFileBase } from '../HiddenFileBase/interface'

export interface IHiddenFileOwner extends IHiddenFileBase {

  /**
   * Generates AES key, saves it and encrypts the file.
   * @param file
   * @returns {@link CryptoMessage} Encrypted file data
   */
  encryptFile: (file: File) => Promise<CryptoMessage>

  /**
   * Decrypts the file if AES key exists.
   * @throws {@link NoAESKeyToDecrypt}
   * @param file
   */
  decryptFile: (fileData: CryptoMessage) => Promise<File>

  /**
   * Encrypts stored AES key (AES key used to encrypt file) with provided publicKey.
   * Public key is not saved, it is used immediately.
   * @param publicKey
   */
  prepareFileAESKeyForBuyer: (publicKey: RSAPublicKey) => Promise<CryptoMessage>

}
