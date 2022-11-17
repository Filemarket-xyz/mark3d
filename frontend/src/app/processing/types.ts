
// AES key is base64 encoded
export const AESEncoding = 'base64' as const
export type AESKey = string

// We are not using higher abstractions specific to the libraries, cos libraries might change
// RSA key is encoded as pkcs8 string
export const RSAEncoding = 'pkcs8' as const
export type RSAPublicKey = string
export type RSAPrivateKey = string

export interface RSAKeyPair {
  pub: RSAPublicKey // public is reserved keyword
  priv: RSAPrivateKey // private is reserved keyword
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

export interface DecryptResultOk<ResultType> {
  ok: true
  result: ResultType
}

export interface DecryptResultError {
  ok: false
  error: string
}

export type DecryptResult<ResultType = CryptoMessage> = DecryptResultOk<ResultType> | DecryptResultError

export interface FileMeta {
  name: string
  type: string // mime type
}

export enum Mark3dAccessTokenEvents {
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  CollectionCreation = 'CollectionCreation',
  OwnershipTransferred = 'OwnershipTransferred',
  RoleAdminChanged = 'RoleAdminChanged',
  RoleGranted = 'RoleGranted',
  RoleRevoked = 'RoleRevoked',
  Transfer = 'Transfer',
}
