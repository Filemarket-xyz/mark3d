
import { FileMarketCrypto } from '../../../../../crypto/src'
import { IBlockchainDataProvider } from '../BlockchainDataProvider'
import { ISeedProvider } from '../SeedProvider'
import { PersistentDerivationArgs } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  #args: PersistentDerivationArgs
  #tokenFullId: [ArrayBuffer, number]

  constructor(
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number,
    public readonly seedProvider: ISeedProvider,
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider
  ) {
    assertSeed(this.seedProvider.seed)

    this.#tokenFullId = [this.collectionAddress, this.tokenId]
    this.#args = [this.seedProvider.seed, blockchainDataProvider.globalSalt, ...this.#tokenFullId]
  }

  async initBuy(dealNumber: number): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { pub } = await this.crypto.eftRsaDerivation(...this.#args, dealNumber)

    return pub
  }

  async revealRsaPrivateKey(dealNumber: number): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const { priv } = await this.crypto.eftRsaDerivation(...this.#args, dealNumber)

    return priv
  }
}
