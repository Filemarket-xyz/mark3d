import { BigNumber } from 'ethers'

export interface IBlockchainDataProvider {

  /**
   * @param collectionAddress
   * @param tokenId
   * @returns Last encrypted password and deal number for file decryption
   */
  getLastTransferInfo: (collectionAddress: ArrayBuffer, tokenId: number) => Promise<{
    encryptedPassword: string
    dealNumber: number
  }>

  /**
   * @param collectionAddress
   * @param tokenId
   * @returns Token creator address
   */
  getTokenCreator: (collectionAddress: ArrayBuffer, tokenId: number) => Promise<`0x${string}`>

  /**
   * @returns The globalSalt
   */
  getGlobalSalt: () => Promise<ArrayBuffer>

  /**
   * @returns The platform fee
   */
  getFee: () => Promise<BigNumber>

  /**
   * @param collectionAddress
   * @param tokenId
   * @returns Transfer count of token with provided tokenId
   */
  getTransferCount: (collectionAddress: ArrayBuffer, tokenId: number) => Promise<number>

  /**
   * @param collectionAddress
   * @param tokenId
   * @param price Current token price
   * @returns Calculated royalty amount
   */
  getRoyaltyAmount: (collectionAddress: ArrayBuffer, tokenId: number, price: BigNumber) => Promise<BigNumber>
}
