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
    encryptedKey: ArrayBuffer | undefined,
    seed: ArrayBuffer,
    globalSalt: ArrayBuffer,
    collectionAddress: ArrayBuffer,
    tokenId: number,
    dealNumber: number | undefined
  ): Promise<DecryptResult<File>> {
    let key: ArrayBuffer
    if (encryptedKey && dealNumber) {
      const { priv } = await fileMarketCrypto.eftRsaDerivation(seed, globalSalt, collectionAddress, tokenId, dealNumber)
      key = await fileMarketCrypto.rsaDecrypt(encryptedKey, priv)
    } else {
      const aesKeyAndIv = await fileMarketCrypto.eftAesDerivation(seed, globalSalt, collectionAddress, tokenId)
      key = aesKeyAndIv.key
    }

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

  async encryptFile(file: File, ...args: Parameters<EftAesDerivationFunction>): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer()
    const aesKeyAndIv = await fileMarketCrypto.eftAesDerivation(...args)
    const encrypted = await fileMarketCrypto.aesEncrypt(arrayBuffer, aesKeyAndIv)

    return new Blob([encrypted])
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
