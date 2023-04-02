export class NoRSAPrivateKeyToRevealError extends Error {
  constructor(surrogateId: string) {
    super(`HiddenFileBuyer: no RSA private key to reveal for surrogateId ${surrogateId}. 
    This is most likely because of revealFraudReportRSAPrivateKey called before initBuy, or stored keys being lost`)
    this.name = 'NoRSAPrivateKeyToRevealError'
  }
}
