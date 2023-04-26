
import { FileMarketCrypto } from '../../../../../crypto/src'
import { ISeedProvider } from '../SeedProvider'
import { PersistentDerivationParams } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  constructor(
    public readonly seedProvider: ISeedProvider,
    public readonly crypto: FileMarketCrypto
  ) {}

  async initBuy(dealNumber: number, ...args: PersistentDerivationParams): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { pub } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)

    return pub
  }

  async revealRsaPrivateKey(dealNumber: number, ...args: PersistentDerivationParams): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)

    return priv
  }
}
