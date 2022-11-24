import { CryptoMessage, DecryptResult, RSAKeyPair, RSAPrivateKey, RSAPublicKey } from '../types'
import { utils } from 'ethers'

const crypto = window.crypto

export const exportRSAPublicKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await crypto.subtle.exportKey('spki', key)
  return utils.hexlify(Buffer.from(exportedKey))
}

export const exportRSAPrivateKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await crypto.subtle.exportKey('pkcs8', key)
  return utils.hexlify(Buffer.from(exportedKey))
}

export const importRSAPublicKey = async (keyHex: RSAPublicKey) => {
  const key = Buffer.from(keyHex.slice(2), 'hex')
  return await crypto.subtle.importKey(
    'spki',
    key,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )
}

export const importRSAPrivateKey = async (keyHex: RSAPrivateKey) => {
  const key = Buffer.from(keyHex.slice(2), 'hex')
  return await crypto.subtle.importKey(
    'pkcs8',
    key,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  )
}

export const genRSAKeyPair = async (): Promise<RSAKeyPair> => {
  const keys = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256', // SHA-1, SHA-256, SHA-384, or SHA-512
      publicExponent: new Uint8Array([1, 0, 1]), // 0x03 or 0x010001
      modulusLength: 2048 // 1024, 2048, or 4096
    },
    true,
    ['encrypt', 'decrypt']
  )
  const priv = await exportRSAPrivateKey(keys.privateKey)
  const pub = await exportRSAPublicKey(keys.publicKey)
  return { pub, priv }
}

export const encryptRSA = async (message: CryptoMessage, key: RSAPublicKey): Promise<Uint8Array> => {
  const publicKey = await importRSAPublicKey(key)
  const ecnData = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, message)
  return new Uint8Array(ecnData)
}

export const decryptRSA = async (message: CryptoMessage, key: RSAPrivateKey): Promise<DecryptResult> => {
  const privateKey = await importRSAPrivateKey(key)
  const data = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, message)
  return {
    ok: true,
    result: new Uint8Array(data)
  }
}
