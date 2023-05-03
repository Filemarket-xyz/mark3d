
import { FileMarketCrypto } from '../../../../../crypto/src'
import { IBlockchainDataProvider } from '../BlockchainDataProvider'
import { ISeedProvider } from '../SeedProvider'
import { PersistentDerivationArgs } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  #persistentArgs: PersistentDerivationArgs

  constructor(
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number
  ) {
    this.#persistentArgs = [this.globalSalt, this.collectionAddress, this.tokenId]
  }

  async initBuy(dealNumber: number): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { pub } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...this.#persistentArgs, dealNumber)

    return pub
  }

  async revealRsaPrivateKey(dealNumber: number): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...this.#persistentArgs, dealNumber)

    return priv
  }
}
