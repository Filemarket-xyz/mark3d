export type HashFunction = (data: ArrayBuffer) => Promise<ArrayBuffer>

export type HmacFunction = (key: ArrayBuffer, payload: ArrayBuffer) => Promise<ArrayBuffer>

export type HkdfFunction = (salt: ArrayBuffer, IKM: ArrayBuffer, info: ArrayBuffer, bitsLength: number) => Promise<ArrayBuffer>

export type EftAesDerivationFunction = (seed: ArrayBuffer, globalSalt: ArrayBuffer, collectionAddress: ArrayBuffer, tokenId: number) => Promise<AesKeyAndIv>

export type EftRsaDerivationFunction = (seed: ArrayBuffer, globalSalt: ArrayBuffer, collectionAddress: ArrayBuffer, tokenId: number , dealNumber: number) => Promise<RsaKeyPair>

// Coded as PKCS8 DER bytes (raw bytes).
// These are bytes between "BEGIN PRIVATE KEY" and "END PRIVATE KEY"
// see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8
export type RsaPrivateKey = ArrayBuffer

// Coded as SubjectPublicKeyInfo bytes (raw bytes).
// These are bytes between "BEGIN PUBLIC KEY" and "END PUBLIC KEY"
// see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#subjectpublickeyinfo
export type RsaPublicKey = ArrayBuffer

export interface RsaKeyPair {
  pub: RsaPublicKey // public is reserved keyword
  priv: RsaPrivateKey // private is reserved keyword
}

export type AesKey = ArrayBuffer

// First 256 are bytes, next 16 bytes are initial vector
export interface AesKeyAndIv {
  key: AesKey,
  iv: ArrayBuffer
}
