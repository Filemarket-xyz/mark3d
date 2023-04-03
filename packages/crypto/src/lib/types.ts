export type HashFunction = (data: ArrayBuffer) => Promise<ArrayBuffer>

export type HmacFunction = (key: ArrayBuffer, payload: ArrayBuffer) => Promise<ArrayBuffer>

export type HkdfFunction = (salt: ArrayBuffer, IKM: ArrayBuffer, info: ArrayBuffer, L: number) => Promise<ArrayBuffer>

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
