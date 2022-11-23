import NodeRSA from 'node-rsa'
import { CryptoMessage, DecryptResult, RSAEncoding, RSAKeyPair, RSAPrivateKey, RSAPublicKey } from '../types'

export const genRSAKeyPair = async (): Promise<RSAKeyPair> => {
  console.log('gen rsa key')
  const key = new NodeRSA({ b: 2048 })
  console.log('gen rsa key succeed')
  const priv = key.exportKey(`${RSAEncoding}-private-pem`)
  const pub = key.exportKey(`${RSAEncoding}-public-pem`)
  return { pub, priv }
}

export const parseRSAKey = (key: RSAPublicKey | RSAPrivateKey) => new NodeRSA().importKey(key)

export const encryptRSA = (message: CryptoMessage, key: RSAPublicKey): Uint8Array => {
  const publicKey = parseRSAKey(key)
  return publicKey.encrypt(message)
}

export const decryptRSA = (message: CryptoMessage, key: RSAPrivateKey): DecryptResult => {
  const privateKey = parseRSAKey(key)
  const result = privateKey.decrypt(Buffer.from(message), 'buffer')
  return {
    ok: true,
    result
  }
}
