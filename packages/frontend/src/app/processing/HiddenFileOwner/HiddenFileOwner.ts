import { FileMarketCrypto } from '../../../../../crypto/src'
import { RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { ISeedProvider } from '../SeedProvider'
import { DecryptResult, FileMeta, PersistentDerivationParams } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileOwner } from './IHiddenFileOwner'

export class HiddenFileOwner implements IHiddenFileOwner {
  constructor(
    public readonly seedProvider: ISeedProvider,
    public readonly crypto: FileMarketCrypto
  ) {}

  async decryptFile(
    encryptedFileData: ArrayBuffer,
    meta: FileMeta | undefined,
    encryptedPassword: ArrayBuffer | undefined,
    dealNumber: number | undefined,
    ...args: PersistentDerivationParams
  ): Promise<DecryptResult<File>> {
    try {
      assertSeed(this.seedProvider.seed)

      let password: ArrayBuffer
      if (encryptedPassword && dealNumber) {
        const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)
        password = await this.crypto.rsaDecrypt(encryptedPassword, priv)
      } else {
        const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...args)
        password = aesKeyAndIv.key
      }

      const decryptedFile = await this.crypto.aesDecrypt(encryptedFileData, password)

      return {
        ok: true,
        result: new File([decryptedFile], meta?.name || 'hidden_file', { type: meta?.type })
      }
    } catch (error) {
      return {
        ok: false,
        error: `Decrypt failed: ${error}`
      }
    }
  }

  async encryptFile(file: File, ...args: PersistentDerivationParams): Promise<Blob> {
    assertSeed(this.seedProvider.seed)

    const arrayBuffer = await file.arrayBuffer()
    const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...args)
    const encrypted = await this.crypto.aesEncrypt(arrayBuffer, aesKeyAndIv)

    return new Blob([encrypted])
  }

  async encryptFilePassword(
    publicKey: RsaPublicKey,
    lastEncryptedPassword: ArrayBuffer | undefined,
    dealNumber: number | undefined,
    ...args: PersistentDerivationParams
  ): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    let password: ArrayBuffer
    if (lastEncryptedPassword && dealNumber) {
      const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)
      password = await this.crypto.rsaDecrypt(lastEncryptedPassword, priv)
    } else {
      const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...args)
      password = aesKeyAndIv.key
    }

    const encryptedPassword = await this.crypto.rsaEncrypt(password, publicKey)

    return encryptedPassword
  }
}
