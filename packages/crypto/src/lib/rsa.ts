import {pki, random} from 'node-forge';
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
    pub: rsaPublicSubjectKeyInfoToBytes(pki.publicKeyToPem(key.publicKey)),
    priv: rsaPrivatePKCS8PemToBytes(pki.privateKeyToPem(key.privateKey)),
  }
}

// It's just a shit. No one has a standard.
const keyWraps: { begin: string, end: string }[] = [
  {
    begin: '-----BEGIN PUBLIC KEY-----',
    end: '-----END PUBLIC KEY-----'
  },
  {
    begin: '-----BEGIN PRIVATE KEY-----',
    end: '-----END PRIVATE KEY-----'
  },
  {
    begin: '-----BEGIN RSA PUBLIC KEY-----',
    end: '-----END RSA PUBLIC KEY-----'
  },
  {
    begin: '-----BEGIN RSA PRIVATE KEY-----',
    end: '-----END RSA PRIVATE KEY-----'
  }
]

function unwrapKey(key: string): string {
  const keyTrim = key.trim()
  for (const wrap of keyWraps) {
    if (keyTrim.startsWith(wrap.begin)) {
      return keyTrim.slice(wrap.begin.length, -wrap.end.length)
    }
  }
  throw new Error('Check key header and footer: could not unwrap key\n' + key)
}

export function rsaPrivatePKCS8PemToBytes(pkcs8KeyPemString: string): RsaPrivateKey {
  const keyB64 = unwrapKey(pkcs8KeyPemString);
  const keyHex = Buffer.from(keyB64, 'base64').toString('hex')
  // Dirty workaround. node-forge pem format export works wrong, so native crypto.subtle
  // is unable to decode it. I am not sure why.
  const fixedKeyHex = keyHex.replace(
    /^308209290201000282020100/,
    '30820943020100300d06092a864886f70d01010105000482092d308209290201000282020100'
  )
  return Buffer.from(fixedKeyHex, 'hex')
}

export function rsaPublicSubjectKeyInfoToBytes(subjectPublicKeyInfo: string): RsaPublicKey {
  const keyB64 = unwrapKey(subjectPublicKeyInfo);
  return Buffer.from(keyB64, 'base64')
}

const importPublicKey = (crypto: Crypto) =>
  async (keyBytes: RsaPublicKey): Promise<CryptoKey> => {
    return await crypto.subtle.importKey(
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
    return await crypto.subtle.importKey(
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
    return await crypto.subtle.encrypt({name: 'RSA-OAEP'}, key, message)
  }

export const rsaDecryptNative = (crypto: Crypto) =>
  async (message: ArrayBuffer, privateKey: RsaPrivateKey): Promise<ArrayBuffer> => {
    const key = await importPrivateKey(crypto)(privateKey)
    return await crypto.subtle.decrypt({name: 'RSA-OAEP'}, key, message)
  }
