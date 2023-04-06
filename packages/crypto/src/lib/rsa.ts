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
  return Buffer.from(keyB64, 'base64')
}

export function rsaPublicSubjectKeyInfoToBytes(subjectPublicKeyInfo: string): RsaPublicKey {
  const keyB64 = unwrapKey(subjectPublicKeyInfo);
  return Buffer.from(keyB64, 'base64')
}
