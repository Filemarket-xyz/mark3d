
import { FileMarketCrypto } from '../../../../../crypto/src'
import { IBlockchainDataProvider } from '../BlockchainDataProvider'
import { ISeedProvider } from '../SeedProvider'
import { PersistentDerivationArgs } from '../types'
import { assertSeed } from '../utils'
import { IHiddenFileBuyer } from './IHiddenFileBuyer'

export class HiddenFileBuyer implements IHiddenFileBuyer {
  #tokenFullIdArgs: [ArrayBuffer, number]
  #persistentArgs: PersistentDerivationArgs

  constructor(
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number
  ) {
    this.#tokenFullIdArgs = [this.collectionAddress, this.tokenId]
    this.#persistentArgs = [this.globalSalt, ...this.#tokenFullIdArgs]
  }

  async initBuy(): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const dealNumber = await this.blockchainDataProvider.getTransferCount(...this.#tokenFullIdArgs)
    const { pub } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...this.#persistentArgs, dealNumber)

    return pub
  }

  async revealRsaPrivateKey(): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const dealNumber = await this.blockchainDataProvider.getTransferCount(...this.#tokenFullIdArgs)
    const { priv } = await this.crypto.eftRsaDerivation(this.seedProvider.seed, ...this.#persistentArgs, dealNumber)

    return priv
  }
}
