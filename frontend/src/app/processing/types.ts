
// Actually many libraries use Buffer, which comes from NodeJS, but is not supported by the browser.
// But Buffer extends Uint8Array, so it is safe to use the second one.

export type AESKey = Uint8Array

// We are not using higher abstractions specific to the libraries, cos libraries might change

export type RSAPublicKey = Uint8Array
export type RSAPrivateKey = Uint8Array

export interface RSAKeyPair {
  public: RSAPublicKey
  private: RSAPrivateKey
}

// Word crypto just to make it differ from a lot of 'Message' types
export type CryptoMessage = Uint8Array

/**
 * Global NFT identifier
 */
export interface TokenFullId {
  /**
   * Collection Id inside AccessToken
   */
  collectionId: string
  /**
   * Token Id inside collection
   */
  tokenId: string
}

export interface DecryptResultOk {
  ok: true
  result: CryptoMessage
}

export interface DecryptResultError {
  ok: false
  // TODO: add error when it's known
}

export type DecryptResult = DecryptResultOk | DecryptResultError
