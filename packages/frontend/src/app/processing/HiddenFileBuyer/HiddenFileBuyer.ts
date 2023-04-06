import { IHiddenFileBuyer } from './IHiddenFileBuyer'
import { IStatefulCryptoProvider } from '../StatefulCryptoProvider'
import { AESEncoding, CryptoMessage, DecryptResult, RSAPrivateKey, RSAPublicKey } from '../types'
import { NoRSAPrivateKeyToRevealError } from './errors'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  constructor(
    public readonly cryptoProvider: IStatefulCryptoProvider,
    public readonly surrogateId: string
  ) {
  }

  async initBuy(): Promise<RSAPublicKey> {
    const pair = await this.cryptoProvider.genRSAKeyPair()
    return pair.pub
  }

  async revealFraudReportRSAPrivateKey(): Promise<RSAPrivateKey> {
    const key = await this.cryptoProvider.getRSAPrivateKey()
    if (!key) {
      throw new NoRSAPrivateKeyToRevealError(this.surrogateId)
    }
    return key
  }

  async saveFileAESKey(encryptedKey: CryptoMessage): Promise<DecryptResult> {
    const decryptResult = await this.cryptoProvider.decryptRSA(encryptedKey)
    if (decryptResult.ok) {
      await this.cryptoProvider.setAESKey(
        Buffer.from(decryptResult.result).toString(AESEncoding)
      )
    }
    return decryptResult
  }
}
