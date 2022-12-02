import { CryptoMessage, DecryptResult, RSAKeyPair, RSAPrivateKey, RSAPublicKey } from '../types'
import { utils } from 'ethers'

const crypto = window.crypto

const publicKeyWrap = {
  begin: '-----BEGIN PUBLIC KEY-----\n',
  end: '\n-----END PUBLIC KEY-----'
}

const privateKeyWrap = {
  begin: '-----BEGIN PRIVATE KEY-----\n',
  end: '\n-----END PRIVATE KEY-----'
}

export const exportRSAPublicKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await crypto.subtle.exportKey('spki', key)
  // non-optimal key encoding, just temporary, to not fix oracle
  const exportedB64 = Buffer.from(exportedKey).toString('base64')
  const exportedPem = `${publicKeyWrap.begin}${exportedB64}${publicKeyWrap.end}`
  return utils.hexlify(Buffer.from(exportedPem, 'utf8'))
}

export const exportRSAPrivateKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await crypto.subtle.exportKey('pkcs8', key)
  const exportedB64 = Buffer.from(exportedKey).toString('base64')
  const exportedPem = `${privateKeyWrap.begin}${exportedB64}${privateKeyWrap.end}`
  return utils.hexlify(Buffer.from(exportedPem, 'utf8'))
}

export const importRSAPublicKey = async (keyHex: RSAPublicKey) => {
  const keyPem = Buffer.from(keyHex.slice(2), 'hex').toString('utf8')
  const keyB64 = keyPem.slice(publicKeyWrap.begin.length, -publicKeyWrap.end.length)
  const keyBytes = Buffer.from(keyB64, 'base64')
  return await crypto.subtle.importKey(
    'spki',
    keyBytes,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-1'
    },
    true,
    ['encrypt']
  )
}

export const importRSAPrivateKey = async (keyHex: RSAPrivateKey) => {
  const keyPem = Buffer.from(keyHex.slice(2), 'hex').toString('utf8')
  const keyB64 = keyPem.slice(privateKeyWrap.begin.length, -privateKeyWrap.end.length)
  const keyBytes = Buffer.from(keyB64, 'base64')
  return await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-1',
    },
    true,
    ['decrypt']
  )
}

export const genRSAKeyPair = async (): Promise<RSAKeyPair> => {
  const keys = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      hash: 'SHA-1', // SHA-1, SHA-256, SHA-384, or SHA-512
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
  const ecnData = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, message);
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
