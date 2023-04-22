import { EftRsaDerivationFunction } from '../../../../../crypto/src/lib/types'
import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { fileMarketCrypto } from '../FileMarketCrypto'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  constructor(public readonly surrogateId: string) {}

  async initBuy(...args: Parameters<EftRsaDerivationFunction>): Promise<`0x${string}`> {
    const { pub } = await fileMarketCrypto.eftRsaDerivation(...args)

    return `0x${buf2Hex(pub)}`
  }

  async revealFraudReportRSAPrivateKey(...args: Parameters<EftRsaDerivationFunction>): Promise<`0x${string}`> {
    const { priv } = await fileMarketCrypto.eftRsaDerivation(...args)

    return `0x${buf2Hex(priv)}`
  }
}
