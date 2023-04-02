export class NoAESKeyToEncrypt extends Error {
  constructor(id: string) {
    super(`CryptoProvider: no AES key corresponding to id ${id} to encrypt the message. 
    This is likely because of encryptAES being called before setAESKey or genAESKey`)
  }
}

export class NoAESKeyToDecrypt extends Error {
  constructor(id: string) {
    super(`CryptoProvider: no AES key corresponding to id ${id} to decrypt the message. 
    This is likely because of decryptAES being called before setAESKey or genAESKey`)
  }
}

export class NoRSAPublicKeyToEncrypt extends Error {
  constructor(id: string) {
    super(`CryptoProvider: no RSA public key corresponding to id ${id} to encrypt the message. 
    This is likely because of encryptRSA being called before genRSAKeyPair`)
  }
}

export class NoRSAPrivateKeyToDecrypt extends Error {
  constructor(id: string) {
    super(`CryptoProvider: no RSA private key corresponding to id ${id} to decrypt the message. 
    This is likely because of decryptRSA being called before genRSAKeyPair`)
  }
}
