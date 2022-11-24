import { IHiddenFileOwner } from './IHiddenFileOwner'
import { IStatefulCryptoProvider } from '../StatefulCryptoProvider'
import { AESEncoding, CryptoMessage, DecryptResult, FileMeta, RSAPublicKey } from '../types'
import { NoAESKeyToSendBuyerError } from './errors'
import { encryptRSA } from '../utils'

export class HiddenFileOwner implements IHiddenFileOwner {
  constructor(
    public readonly cryptoProvider: IStatefulCryptoProvider,
    public readonly surrogateId: string
  ) {
  }

  async decryptFile(encryptedFileData: CryptoMessage, meta: FileMeta): Promise<DecryptResult<File>> {
    const result = await this.cryptoProvider.decryptRSA(encryptedFileData)
    if (result.ok) {
      return {
        ok: true,
        result: new File([result.result], meta.name, { type: meta.type })
      }
    }
    return result
  }

  async encryptFile(file: File): Promise<CryptoMessage> {
    await this.cryptoProvider.genAESKey()
    const fileData = new Uint8Array(await file.arrayBuffer())
    return await this.cryptoProvider.encryptAES(fileData)
  }

  async prepareFileAESKeyForBuyer(publicKey: RSAPublicKey): Promise<CryptoMessage> {
    const key = await this.cryptoProvider.getAESKey()
    if (!key) {
      throw new NoAESKeyToSendBuyerError(this.surrogateId)
    }
    return await encryptRSA(Buffer.from(key, AESEncoding), publicKey)
  }
}
