/* eslint-disable max-len */
import { RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { IHiddenFileBase } from '../HiddenFileBase'
import { DecryptResult, FileMeta, PersistentDerivationParams } from '../types'

/**
 * Used to mint and sell NFT
 */
export interface IHiddenFileOwner extends IHiddenFileBase {

  /**
   * Generates AES key, saves it and encrypts the file.
   * @param file
   * @returns {@link ArrayBuffer} Encrypted file data
   */
  encryptFile: (file: File, ...args: PersistentDerivationParams) => Promise<Blob>

  /**
   * Decrypts the file if AES key exists.
   * @param file
   */
  decryptFile: (encryptedFileData: ArrayBuffer, meta: FileMeta | undefined, encryptedKey: ArrayBuffer | undefined, dealNumber: number | undefined, ...args: PersistentDerivationParams) => Promise<DecryptResult<File>>

  /**
   * Encrypts stored AES key (AES key used to encrypt file) with provided publicKey.
   * Public key is not saved, it is used immediately.
   * @param publicKey
   */
  encryptFilePassword: (publicKey: RsaPublicKey, ...args: PersistentDerivationParams) => Promise<`0x${string}`>

}
