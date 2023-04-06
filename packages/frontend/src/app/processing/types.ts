
// AES key is base64 encoded

export const AESEncoding = 'base64' as const
export type AESKey = string

// We are not using higher abstractions specific to the libraries, cos libraries might change
// RSA key is encoded as hex string, obtained by hex encoding result of pkcs8 or spki key export
export type RSAPublicKey = string // 0x12...
export type RSAPrivateKey = string // 0x12...

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
   * Collection address (not id). Address is more useful when calling contracts
   */
  collectionAddress: string
  /**
   * Normalized token id (not address). Is obtained as a result of the mint.
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
  name?: string
  type?: string // mime type
  size?: number // in bytes
}

export interface ERC721TokenMeta {
  name?: string
  description?: string
  image?: string
  external_link?: string
  hidden_file?: string
  hidden_file_meta?: FileMeta
}

export interface ERC721TokenMetaInput {
  name?: string
  description?: string
  image?: File | Blob
  external_link?: string
  hidden_file?: File | Blob
  hidden_file_meta?: FileMeta
}

export enum Mark3dAccessTokenEventNames {
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  CollectionCreation = 'CollectionCreation',
  OwnershipTransferred = 'OwnershipTransferred',
  RoleAdminChanged = 'RoleAdminChanged',
  RoleGranted = 'RoleGranted',
  RoleRevoked = 'RoleRevoked',
  Transfer = 'Transfer',
}

export enum HiddenFilesTokenEventNames {
  TransferInit = 'TransferInit',
  TransferDraft = 'TransferDraft',
  TransferDraftCompletion = 'TransferDraftCompletion',
  TransferPublicKeySet = 'TransferPublicKeySet',
  TransferPasswordSet = 'TransferPasswordSet',
  TransferFinished = 'TransferFinished',
  TransferFraudReported = 'TransferFraudReported',
  TransferFraudDecided = 'TransferFraudDecided',
  TransferCancellation = 'TransferCancellation',
}

export enum HiddenFilesTokenEventSignatures {
  TransferInit = 'TransferInit(uint256,address,address)',
  TransferDraft = 'TransferDraft(uint256,address)',
  TransferDraftCompletion = 'TransferDraftCompletion(uint256,address)',
  TransferPublicKeySet = 'TransferPublicKeySet(uint256,bytes)',
  TransferPasswordSet = 'TransferPasswordSet(uint256,bytes)',
  TransferFinished = 'TransferFinished(uint256)',
  TransferFraudReported = 'TransferFraudReported(uint256)',
  TransferFraudDecided = 'TransferFraudDecided(uint256,bool)',
  TransferCancellation = 'TransferCancellation(uint256)',
}

export enum ERC721TokenEventNames {
  Transfer = 'Transfer',
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
}

export enum ERC721TokenEventSignatures {
  Approval = 'Approval(address,address,uint256)',
  ApprovalForAll = 'ApprovalForAll(address,address,bool)',
  Transfer = 'Transfer(address,address,uint256)',
}
