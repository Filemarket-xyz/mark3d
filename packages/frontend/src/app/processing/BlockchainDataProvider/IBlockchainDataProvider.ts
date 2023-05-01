export interface IBlockchainDataProvider {
  globalSalt: ArrayBuffer

  /**
   * @param collectionAddress
   * @param tokenId
   * @returns Last encrypted password and deal number for file decryption
   */
  getLastTransferInfo: (collectionAddress: ArrayBuffer, tokenId: number) => Promise<{
    encryptedPassword: string
    dealNumber: number
  }>
}
