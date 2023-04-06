/**
 * Install
 * ```sh
 * yarn add file-market-crypto
 * ```
 */
import {
  AesKey,
  EftAesDerivationFunction,
  EftRsaDerivationFunction,
  HashFunction,
  HkdfFunction,
  HmacFunction, RsaKeyPair
} from './lib/types';
import {sha512Native, sha512} from './lib/sha512';
import {rsaGenerateKeyPair} from './lib/rsa';
import {hmacSha512, hmacSha512Native} from './lib/hmac-sha512';
import {hkdfSha512, hkdfSha512Native} from './lib/hkdf-sha512';
import {eftAesDerivation, eftAesDerivationNative, eftRsaDerivation, eftRsaDerivationNative} from './lib/eft-derivation';


export class FileMarketCrypto {
  // If crypto is provided, native crypto functions will be preferred
  constructor(private crypto?: Crypto) {
  }

  sha512: HashFunction = async (...args): Promise<ArrayBuffer> => {
    if (this.crypto) {
      return await sha512Native(this.crypto)(...args)
    } else {
      return await sha512(...args)
    }
  }

  rsaGenerateKeyPair = rsaGenerateKeyPair

  hmacSha512: HmacFunction = async (...args): Promise<ArrayBuffer> => {
    if (this.crypto) {
      return await hmacSha512Native(this.crypto)(...args)
    } else {
      return await hmacSha512(...args)
    }
  }

  hkdfSha512: HkdfFunction = async (...args): Promise<ArrayBuffer> => {
    if (this.crypto) {
      return await hkdfSha512Native(this.crypto)(...args)
    } else {
      return await hkdfSha512(...args)
    }
  }

  eftAesDerivation: EftAesDerivationFunction = async (...args): Promise<AesKey> => {
    if (this.crypto) {
      return await eftAesDerivationNative(this.crypto)(...args)
    } else {
      return await eftAesDerivation(...args)
    }
  }

  eftRsaDerivation: EftRsaDerivationFunction = async (...args): Promise<RsaKeyPair> => {
    if (this.crypto) {
      return await eftRsaDerivationNative(this.crypto)(...args)
    } else {
      return await eftRsaDerivation(...args)
    }
  }
}

