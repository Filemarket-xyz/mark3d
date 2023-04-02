export class NoAESKeyToSendBuyerError extends Error {
  constructor(surrogateId: string) {
    super(`HiddenFileOwner: no AES key for surrogateId ${surrogateId} to send the buyer.
    This is likely because of prepareFileAESKeyForBuyer being called before encryptFile or stored keys being lost`)
    this.name = 'NoAESKeyToSendBuyerError'
  }
}
