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

  /**
   * Requests the globalSalt once and sets it.
   */
  setGlobalSalt: () => Promise<void>

  /**
   * @param address
   * @returns The addres of the owner, and therefore the creator of the collection
   */
  getCollectionCreator: (address: ArrayBuffer) => Promise<`0x${string}`>
}
