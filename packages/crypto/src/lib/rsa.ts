import {pki, random, asn1} from 'node-forge';
import {rsaModulusLength} from './config';
import {RsaKeyPair, RsaPrivateKey, RsaPublicKey} from './types';

export const rsaGenerateKeyPair = async (seed: ArrayBuffer): Promise<RsaKeyPair> => {
  const seedHex = Buffer.from(seed).toString('hex')
  // seed pseudo random number generation
  const prng = random.createInstance();
  prng.seedFileSync = () => seedHex
  // workers 0 is necessary for deterministic key generation
  const key = pki.rsa.generateKeyPair({bits: rsaModulusLength, workers: 0, prng})

  return {
    pub: rsaPublicSubjectKeyInfoToBytes(key.publicKey),
    priv: rsaPrivateKeyPKCS8ToBytes(key.privateKey),
  }
}

const rsaPrivateKeyPKCS8ToBytes = (privateKey: pki.rsa.PrivateKey): RsaPrivateKey => {
  const privateKeyAsn1 = pki.privateKeyToAsn1(privateKey);
  // privateKey comes without additional info about it and window.crypto.importKey can't recognize it
  // so we need to wrap this privateKey in ASN.1 object with additional data (version, algorithmId)
  const privateKeyInfoAsn1 = pki.wrapRsaPrivateKey(privateKeyAsn1);
  const privateKeyDer = asn1.toDer(privateKeyInfoAsn1);

  return Buffer.from(privateKeyDer.toHex(), 'hex')
}

const rsaPublicSubjectKeyInfoToBytes = (publicKey: pki.rsa.PublicKey): RsaPublicKey => {
  const publicKeyAsn1 = pki.publicKeyToAsn1(publicKey);
  const publicKeyDer = asn1.toDer(publicKeyAsn1);

  return Buffer.from(publicKeyDer.toHex(), 'hex')
}

const importPublicKey = (crypto: Crypto) =>
  async (keyBytes: RsaPublicKey): Promise<CryptoKey> => {
    return crypto.subtle.importKey(
      'spki',
      keyBytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-512'
      },
      false,
      ['encrypt']
    )
  }

const importPrivateKey = (crypto: Crypto) =>
  async (keyBytes: RsaPrivateKey): Promise<CryptoKey> => {
    return crypto.subtle.importKey(
      'pkcs8',
      keyBytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-512'
      },
      true,
      ['decrypt']
    )
  }

export const rsaEncryptNative = (crypto: Crypto) =>
  async (message: ArrayBuffer, publicKey: RsaPublicKey): Promise<ArrayBuffer> => {
    const key = await importPublicKey(crypto)(publicKey)
    return crypto.subtle.encrypt({name: 'RSA-OAEP'}, key, message)
  }

export const rsaDecryptNative = (crypto: Crypto) =>
  async (message: ArrayBuffer, privateKey: RsaPrivateKey): Promise<ArrayBuffer> => {
    const key = await importPrivateKey(crypto)(privateKey)
    return crypto.subtle.decrypt({name: 'RSA-OAEP'}, key, message)
  }
