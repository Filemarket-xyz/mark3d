import { utils } from 'ethers'

import { FileMarketCrypto } from '../../../../../crypto/src'
import { RsaPublicKey } from '../../../../../crypto/src/lib/types'
import { IBlockchainDataProvider } from '../BlockchainDataProvider'
import { ISeedProvider } from '../SeedProvider'
import { DecryptResult, FileMeta, PersistentDerivationArgs } from '../types'
import { assertSeed, hexToBuffer } from '../utils'
import { IHiddenFileOwner } from './IHiddenFileOwner'

export class HiddenFileOwner implements IHiddenFileOwner {
  #persistentArgs: PersistentDerivationArgs
  #tokenFullIdArgs: [ArrayBuffer, number]
  #isFirefox: boolean

  constructor(
    public readonly address: string,
    public readonly crypto: FileMarketCrypto,
    public readonly blockchainDataProvider: IBlockchainDataProvider,
    public readonly seedProvider: ISeedProvider,
    public readonly globalSalt: ArrayBuffer,
    public readonly collectionAddress: ArrayBuffer,
    public readonly tokenId: number,
  ) {
    this.#tokenFullIdArgs = [this.collectionAddress, this.tokenId]
    this.#persistentArgs = [this.globalSalt, ...this.#tokenFullIdArgs]
    this.#isFirefox = navigator.userAgent.includes('Firefox')
  }

  async decryptFile(encryptedFile: ArrayBuffer, meta: FileMeta | undefined): Promise<DecryptResult<File>> {
    assertSeed(this.seedProvider.seed)

    try {
      const creator = await this.blockchainDataProvider.getCollectionCreator(this.collectionAddress)

      let password: ArrayBuffer
      if (this.address === utils.getAddress(creator)) {
        const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...this.#persistentArgs)
        password = aesKeyAndIv.key
      } else {
        const {
          encryptedPassword,
          dealNumber,
        } = await this.blockchainDataProvider.getLastTransferInfo(...this.#tokenFullIdArgs)

        const { priv } = await this.crypto.eftRsaDerivation(
          this.seedProvider.seed,
          ...this.#persistentArgs,
          dealNumber,
          { disableWorker: this.#isFirefox },
        )
        password = await this.crypto.rsaDecrypt(hexToBuffer(encryptedPassword), priv)
      }

      const decryptedFile = await this.crypto.aesDecrypt(encryptedFile, password)

      return {
        ok: true,
        result: new File([decryptedFile], meta?.name || 'hidden_file', { type: meta?.type }),
      }
    } catch (error) {
      return {
        ok: false,
        error: `Decrypt failed: ${error}`,
      }
    }
  }

  async encryptFile(file: File): Promise<Blob> {
    assertSeed(this.seedProvider.seed)

    const arrayBuffer = await file.arrayBuffer()
    const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...this.#persistentArgs)
    const encrypted = await this.crypto.aesEncrypt(arrayBuffer, aesKeyAndIv)

    return new Blob([encrypted])
  }

  async encryptFilePassword(publicKey: RsaPublicKey): Promise<ArrayBuffer> {
    assertSeed(this.seedProvider.seed)

    const creator = await this.blockchainDataProvider.getCollectionCreator(this.collectionAddress)

    let password: ArrayBuffer
    if (this.address === utils.getAddress(creator)) {
      const aesKeyAndIv = await this.crypto.eftAesDerivation(this.seedProvider.seed, ...this.#persistentArgs)
      password = aesKeyAndIv.key
    } else {
      const {
        encryptedPassword: lastEncryptedPassword,
        dealNumber,
      } = await this.blockchainDataProvider.getLastTransferInfo(...this.#tokenFullIdArgs)

      const { priv } = await this.crypto.eftRsaDerivation(
        this.seedProvider.seed,
        ...this.#persistentArgs,
        dealNumber,
        { disableWorker: this.#isFirefox },
      )
      password = await this.crypto.rsaDecrypt(hexToBuffer(lastEncryptedPassword), priv)
    }

    const encryptedPassword = await this.crypto.rsaEncrypt(password, publicKey)

    return encryptedPassword
  }
}
