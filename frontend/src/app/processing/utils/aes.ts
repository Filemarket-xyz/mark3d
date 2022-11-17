import { AESEncoding, AESKey, CryptoMessage, DecryptResult } from '../types'
import { pbkdf2 } from 'pbkdf2'
import { randomBytes, sha256 } from 'ethers/lib/utils'
import { AES, ByteSource, padding } from 'aes-js'

export const parseAESKey = (key: AESKey) => Buffer.from(key)

export const genAESKey = async (): Promise<AESKey> => {
  const key = await new Promise<Buffer>((resolve, reject) => {
    pbkdf2(
      randomBytes(32),
      randomBytes(32),
      1,
      32,
      (err, derivedKey) => {
        if (err) {
          reject(err)
        } else {
          resolve(derivedKey)
        }
      })
  })
  return key.toString(AESEncoding)
}

export const encryptAES = (message: CryptoMessage, key: AESKey): Uint8Array => {
  const AESKey = parseAESKey(key)
  const cipher = new AES(AESKey)

  let toEncrypt: Uint8Array = padding.pkcs7.pad(message)

  const hash = sha256(toEncrypt)
  toEncrypt = Buffer.concat([toEncrypt, Buffer.from(hash, 'hex')])

  // TODO: use secure CBC with initial vector
  const encryptedChunks: Uint8Array[] = []
  for (let i = 0; i < toEncrypt.length; i += 16) {
    const chunk = toEncrypt.subarray(i, i + 16)
    const encryptedChunk = cipher.encrypt(chunk)
    encryptedChunks.push(new Uint8Array(encryptedChunk))
  }
  return Buffer.concat(encryptedChunks)
}

export const decryptAES = (message: CryptoMessage, key: AESKey): DecryptResult => {
  const AESKey = parseAESKey(key)
  const cipher = new AES(AESKey)

  if (message.length === 0 || message.length % 16 !== 0) {
    return {
      ok: false,
      error: 'encrypted data length is not a multiple of 16'
    }
  }

  const chunks: Uint8Array[] = []
  for (let i = 0; i < message.length; i++) {
    const encryptedChunk = message.subarray(i, i + 16)
    // types are missing for the decrypt function
    const chunk: ByteSource = (cipher as any).decrypt(encryptedChunk)
    chunks.push(new Uint8Array(chunk))
  }

  const decrypted = Buffer.concat(chunks)

  const hash = decrypted.subarray(decrypted.length - 32, decrypted.length)

  const withoutHash = decrypted.subarray(0, decrypted.length - 32)

  const computedHash = sha256(withoutHash)

  if (!hash.equals(Buffer.from(computedHash, 'hex'))) {
    return {
      ok: false,
      error: 'decrypted data does not match checksum'
    }
  }

  const result = padding.pkcs7.strip(withoutHash)
  return {
    ok: true,
    result
  }
}
