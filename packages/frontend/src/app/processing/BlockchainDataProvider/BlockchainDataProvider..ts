import { BigNumber } from 'ethers'

import { ContractProvider, contractProvider } from '../ContractProvider'
import { bufferToEtherHex, callContractGetter, hexToBuffer } from '../utils'
import { IBlockchainDataProvider } from './IBlockchainDataProvider'

export class BlockchainDataProvider implements IBlockchainDataProvider {
  readonly #url: string

  constructor(
    private readonly contractProvider: ContractProvider,
    readonly baseUrl: string = '/api',
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
      { method: 'GET' },
    )

    return this.#stringifyResponse(response)
  }

  async getGlobalSalt() {
    const contract = this.contractProvider.getAccessTokenContract()

    const globalSalt = await callContractGetter<`0x${string}`>({ contract, method: 'globalSalt' })

    return hexToBuffer(globalSalt)
  }

  async getTokenCreator(collectionAddress: ArrayBuffer, tokenId: number) {
    const response = await fetch(
      `${this.#url}/tokens/${bufferToEtherHex(collectionAddress)}/${tokenId}`,
      { method: 'GET' },
    )

    const data = await this.#stringifyResponse(response)

    return data.creator
  }

  async getTransferCount(collectionAddress: ArrayBuffer, tokenId: number) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(collectionAddress))

    const transferCountBN = await callContractGetter<BigNumber>(
      { contract, method: 'transferCounts' },
      BigNumber.from(tokenId),
    )

    return transferCountBN.toNumber()
  }

  async getFee() {
    const contract = this.contractProvider.getExchangeContract()

    return callContractGetter<BigNumber>({ contract, method: 'fee' })
  }

  async getRoyaltyAmount(collectionAddress: ArrayBuffer, tokenId: number, price: BigNumber) {
    const contract = this.contractProvider.getCollectionContract(bufferToEtherHex(collectionAddress))

    const { royaltyAmount } = await callContractGetter<{ royaltyAmount: BigNumber }>(
      { contract, method: 'royaltyInfo' },
      BigNumber.from(tokenId),
      price,
    )

    return royaltyAmount
  }
}

/**
 * Exists as singleton
 */
export const blockchainDataProvider = new BlockchainDataProvider(contractProvider)
