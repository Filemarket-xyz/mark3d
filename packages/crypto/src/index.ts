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
import {rsaDecryptNative, rsaEncryptNative, rsaGenerateKeyPair} from './lib/rsa';
import {hmacSha512Native} from './lib/hmac-sha512';
import {hkdfSha512Native} from './lib/hkdf-sha512';
import {eftAesDerivationNative, eftRsaDerivationNative} from './lib/eft-derivation';
import {aesDecryptNative, aesEncryptNative} from './lib/aes';


export class FileMarketCrypto {

  // For now, you MUST use native crypto underneath,
  // but it could be not native in the future
  constructor(private crypto: Crypto) {
  }

  sha512: HashFunction = async (...args): Promise<ArrayBuffer> => {
    return await sha512Native(this.crypto)(...args)
  }

  rsaGenerateKeyPair = rsaGenerateKeyPair

  hmacSha512: HmacFunction = async (...args): Promise<ArrayBuffer> => {
    return await hmacSha512Native(this.crypto)(...args)
  }

  hkdfSha512: HkdfFunction = async (...args): Promise<ArrayBuffer> => {
    return await hkdfSha512Native(this.crypto)(...args)
  }

  eftAesDerivation: EftAesDerivationFunction = async (...args): Promise<AesKeyAndIv> => {
    return await eftAesDerivationNative(this.crypto)(...args)
  }

  eftRsaDerivation: EftRsaDerivationFunction = async (...args): Promise<RsaKeyPair> => {
    return await eftRsaDerivationNative(this.crypto)(...args)
  }

  rsaEncrypt = async (data: ArrayBuffer, key: RsaPublicKey): Promise<ArrayBuffer> => {
    return await rsaEncryptNative(this.crypto)(data, key)
  }

  rsaDecrypt = async (data: ArrayBuffer, key: RsaPrivateKey): Promise<ArrayBuffer> => {
    return await rsaDecryptNative(this.crypto)(data, key)
  }

  aesEncrypt = async (data: ArrayBuffer, key: AesKeyAndIv): Promise<ArrayBuffer> => {
    return await aesEncryptNative(this.crypto)(data, key)
  }

  aesDecrypt = async (data: ArrayBuffer, key: AesKey): Promise<ArrayBuffer> => {
    return await aesDecryptNative(this.crypto)(data, key)
  }
}

