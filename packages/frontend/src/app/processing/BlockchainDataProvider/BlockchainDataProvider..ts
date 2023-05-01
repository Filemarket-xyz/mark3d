import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { globalSaltMock } from '../utils'
import { IBlockchainDataProvider } from './IBlockchainDataProvider'

export class BlockchainDataProvider implements IBlockchainDataProvider {
  readonly #url: string
  globalSalt = globalSaltMock

  constructor(readonly baseUrl: string = '/api') {
    this.#url = baseUrl
  }

  async getLastTransferInfo(collectionAddress: ArrayBuffer, tokenId: number) {
    const response = await fetch(
      `${this.#url}/tokens/${buf2Hex(collectionAddress)}/${tokenId}/encrypted_password`,
      { method: 'GET' }
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message)
    }

    return data
  }
}

/**
 * Exists as singleton
 */
export const blockchainDataProvider = new BlockchainDataProvider()
