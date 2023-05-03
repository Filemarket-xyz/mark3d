import { ContractProvider, contractProvider } from '../ContractProvider'
import { bufferToEtherHex, hexToBuffer } from '../utils'
import { IBlockchainDataProvider } from './IBlockchainDataProvider'

export class BlockchainDataProvider implements IBlockchainDataProvider {
  readonly #url: string

  constructor(
    private readonly contractProvider: ContractProvider,
    readonly baseUrl: string = '/api'
  ) {
    this.#url = baseUrl
  }

  async #stringifyResponse(response: Response) {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message)
    }

    return data
  }

  async getLastTransferInfo(collectionAddress: ArrayBuffer, tokenId: number) {
    const response = await fetch(
      `${this.#url}/tokens/${bufferToEtherHex(collectionAddress)}/${tokenId}/encrypted_password`,
      { method: 'GET' }
    )

    return this.#stringifyResponse(response)
  }

  async getGlobalSalt() {
    const contract = this.contractProvider.getAccessTokenContract()
    const globalSalt = await contract.globalSalt()

    return hexToBuffer(globalSalt)
  }

  async getCollectionCreator(address: ArrayBuffer) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(address))

    return contract.owner()
  }
}

/**
 * Exists as singleton
 */
export const blockchainDataProvider = new BlockchainDataProvider(contractProvider)
