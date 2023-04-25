
import { FileMarketCrypto } from '../../../../../crypto/src'
import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { ISeedProvider } from '../SeedProvider'
import { PersistentDerivationParams } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  constructor(
    public readonly seedProvider: ISeedProvider,
    public readonly crypto: FileMarketCrypto
  ) {}

  async initBuy(dealNumber: number, ...args: PersistentDerivationParams): Promise<`0x${string}`> {
    assertSeed(this.seedProvider.seed)

    const { pub } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)

    return `0x${buf2Hex(pub)}`
  }

  async revealRsaPrivateKey(dealNumber: number, ...args: PersistentDerivationParams): Promise<`0x${string}`> {
    assertSeed(this.seedProvider.seed)

    const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...args, dealNumber)

    return `0x${buf2Hex(priv)}`
  }
}
