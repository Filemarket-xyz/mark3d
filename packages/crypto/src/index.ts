/**
 * Install
 * ```sh
 * yarn add file-market-crypto
 * ```
 */
import {
  AesKey,
  AesKeyAndIv,
  EftAesDerivationFunction,
  EftRsaDerivationFunction,
  HashFunction,
  HkdfFunction,
  HmacFunction,
  RsaKeyPair,
  RsaPrivateKey,
  RsaPublicKey
} from './lib/types';
import {sha512Native} from './lib/sha512';
import {rsaDecryptNative, rsaEncryptNative} from './lib/rsa';
import {hmacSha512Native} from './lib/hmac-sha512';
import {hkdfSha512Native} from './lib/hkdf-sha512';
import {eftAesDerivationNative, eftRsaDerivationNative} from './lib/eft-derivation';
import {aesDecryptNative, aesEncryptNative} from './lib/aes';
import forge from 'node-forge';


export class FileMarketCrypto {

  // Usually crypto is just window.crypto
  // For now, you MUST use native crypto underneath,
  // but it could be not native in the future
  constructor(private crypto: Crypto = window.crypto) {
    // @ts-ignore
    forge.options.usePureJavaScript = true;
  }

  sha512: HashFunction = async (...args): Promise<ArrayBuffer> => {
    return sha512Native(this.crypto)(...args)
  }

  // rsaGenerateKeyPair = rsaGenerateKeyPair

  hmacSha512: HmacFunction = async (...args): Promise<ArrayBuffer> => {
    return hmacSha512Native(this.crypto)(...args)
  }

  hkdfSha512: HkdfFunction = async (...args): Promise<ArrayBuffer> => {
    return hkdfSha512Native(this.crypto)(...args)
  }

  eftAesDerivation: EftAesDerivationFunction = async (...args): Promise<AesKeyAndIv> => {
    return eftAesDerivationNative(this.crypto)(...args)
  }

  eftRsaDerivation: EftRsaDerivationFunction = async (...args): Promise<RsaKeyPair> => {
    return eftRsaDerivationNative(this.crypto)(...args)
  }

  rsaEncrypt = async (data: ArrayBuffer, key: RsaPublicKey): Promise<ArrayBuffer> => {
    return rsaEncryptNative(this.crypto)(data, key)
  }

  rsaDecrypt = async (data: ArrayBuffer, key: RsaPrivateKey): Promise<ArrayBuffer> => {
    return rsaDecryptNative(this.crypto)(data, key)
  }

  aesEncrypt = async (data: ArrayBuffer, key: AesKeyAndIv): Promise<ArrayBuffer> => {
    return aesEncryptNative(this.crypto)(data, key)
  }

  aesDecrypt = async (data: ArrayBuffer, key: AesKey): Promise<ArrayBuffer> => {
    return aesDecryptNative(this.crypto)(data, key)
  }
}

