import { FileMarketCrypto } from '../../../../../crypto/src'
import { RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { buf2Hex } from '../../../../../crypto/src/lib/utils'
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

      let key: ArrayBuffer
      if (encryptedPassword && dealNumber) {
        const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)
        key = await this.crypto.rsaDecrypt(encryptedPassword, priv)
      } else {
        const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...args)
        key = aesKeyAndIv.key
      }

      const decryptedFile = await this.crypto.aesDecrypt(encryptedFileData, key)

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
    ...args: PersistentDerivationParams
  ): Promise<`0x${string}`> {
    assertSeed(this.seedProvider.seed)

    const { key } = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...args)
    const encryptedPassword = await this.crypto.rsaEncrypt(key, publicKey)

    return `0x${buf2Hex(encryptedPassword)}`
  }
}
