
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
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number
  ) {
    assertSeed(this.seedProvider.seed)

    this.#tokenFullId = [this.collectionAddress, this.tokenId]
    this.#args = [this.seedProvider.seed, this.globalSalt, ...this.#tokenFullId]
  }

  async initBuy(dealNumber: number): Promise<ArrayBuffer> {
    const { pub } = await this.crypto.eftRsaDerivation(...this.#args, dealNumber)

    return pub
  }

  async revealRsaPrivateKey(dealNumber: number): Promise<ArrayBuffer> {
    const { priv } = await this.crypto.eftRsaDerivation(...this.#args, dealNumber)

    return priv
  }
}
