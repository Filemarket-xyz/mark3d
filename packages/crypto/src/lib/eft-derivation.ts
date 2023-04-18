// See https://outline.customapp.tech/doc/shifrovanie-i-derivaciya-fYE6XPQHkq#h-derivaciya-klyuchej

import {AesKeyAndIv, EftAesDerivationFunction, EftRsaDerivationFunction, HkdfFunction, RsaKeyPair} from './types';
import {aesIVLength, aesKeyLength, aesKeyType, rsaKeyType, rsaModulusLength} from './config';
import {num2Buf} from './utils';
import {hkdfSha512, hkdfSha512Native} from './hkdf-sha512';
import {rsaGenerateKeyPair} from './rsa';

export const eftAesDerivationNative = (crypto: Crypto): EftAesDerivationFunction =>
  async (seed, globalSalt, collectionAddress, tokenId) =>
    await eftAesDerivationAux(hkdfSha512Native(crypto), seed, globalSalt, collectionAddress, tokenId)

export const eftAesDerivation: EftAesDerivationFunction =
  async (seed, globalSalt, collectionAddress, tokenId) =>
    await eftAesDerivationAux(hkdfSha512, seed, globalSalt, collectionAddress, tokenId)

export const eftRsaDerivationNative = (crypto: Crypto): EftRsaDerivationFunction =>
  async (seed, globalSalt, collectionAddress, tokenId, dealNumber) =>
    await eftRsaDerivationAux(hkdfSha512Native(crypto), seed, globalSalt, collectionAddress, tokenId, dealNumber)

export const eftRsaDerivation: EftRsaDerivationFunction =
  async (seed, globalSalt, collectionAddress, tokenId, dealNumber) =>
    await eftRsaDerivationAux(hkdfSha512, seed, globalSalt, collectionAddress, tokenId, dealNumber)

const eftAesDerivationAux = async (
  hkdf: HkdfFunction, seed: ArrayBuffer, globalSalt: ArrayBuffer, collectionAddress: ArrayBuffer, tokenId: number
): Promise<AesKeyAndIv> => {
  const OKM = await hkdf(
    globalSalt,
    seed,
    Buffer.concat([
      aesKeyType,
      Buffer.from(collectionAddress),
      num2Buf(tokenId)]),
    aesKeyLength + aesIVLength
  )
  return {
    key: OKM.slice(0, aesKeyLength / 8),
    iv: OKM.slice(aesKeyLength / 8, (aesKeyLength + aesIVLength) / 8)
  }
}

const eftRsaDerivationAux = async (
  hkdf: HkdfFunction,
  seed: ArrayBuffer,
  globalSalt: ArrayBuffer,
  collectionAddress: ArrayBuffer,
  tokenId: number,
  dealNumber: number
): Promise<RsaKeyPair> => {
  const OKM = await hkdf(
    globalSalt,
    seed,
    Buffer.concat([
      rsaKeyType,
      Buffer.from(collectionAddress),
      num2Buf(tokenId),
      num2Buf(dealNumber)]),
    rsaModulusLength,
  )
  return await rsaGenerateKeyPair(OKM)
}

