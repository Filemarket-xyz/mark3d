import { EftAesDerivationFunction, RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { fileMarketCrypto } from '../FileMarketCrypto'
import { DecryptResult, FileMeta } from '../types'
import { IHiddenFileOwner } from './IHiddenFileOwner'

export class HiddenFileOwner implements IHiddenFileOwner {
  constructor(public readonly surrogateId: string) {}

  async decryptFile(
    encryptedFileData: ArrayBuffer,
    meta: FileMeta | undefined,
    ...args: Parameters<EftAesDerivationFunction>
  ): Promise<DecryptResult<File>> {
    const { key } = await fileMarketCrypto.eftAesDerivation(...args)

    try {
      const decryptedFile = await fileMarketCrypto.aesDecrypt(encryptedFileData, key)

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

  async encryptFile(file: File, ...args: Parameters<EftAesDerivationFunction>): Promise<ArrayBuffer> {
    const arrayBuffer = await file.arrayBuffer()
    const aesKeyAndIv = await fileMarketCrypto.eftAesDerivation(...args)

    return fileMarketCrypto.aesEncrypt(arrayBuffer, aesKeyAndIv)
  }

  async prepareFileAESKeyForBuyer(
    publicKey: RsaPublicKey,
    ...args: Parameters<EftAesDerivationFunction>
  ): Promise<`0x${string}`> {
    const { key } = await fileMarketCrypto.eftAesDerivation(...args)
    const encryptedPublicKey = await fileMarketCrypto.rsaEncrypt(key, publicKey)

    return `0x${buf2Hex(encryptedPublicKey)}`
  }
}
