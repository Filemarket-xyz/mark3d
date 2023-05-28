// See https://outline.customapp.tech/doc/shifrovanie-i-derivaciya-fYE6XPQHkq#h-derivaciya-klyuchej

import {AesKeyAndIv, EftAesDerivationFunction, EftRsaDerivationFunction, HkdfFunction, RsaKeyPair} from './types';
import {aesIVLength, aesKeyLength, aesKeyType, rsaKeyType, rsaModulusLength} from './config';
import {numberToBuffer} from './utils';
import {hkdfSha512, hkdfSha512Native} from './hkdf-sha512';
// to get the worker into the build
// @ts-ignore
import * as RsaWorker from '../dedicated-wokrers/rsa.worker.js'
const rsaWorkerUrl = new URL('../dedicated-wokrers/rsa.worker.js', import.meta.url)

export const eftAesDerivationNative = (crypto: Crypto): EftAesDerivationFunction =>
  async (seed, globalSalt, collectionAddress, tokenId) =>
    eftAesDerivationAux(hkdfSha512Native(crypto), seed, globalSalt, collectionAddress, tokenId)

export const eftAesDerivation: EftAesDerivationFunction =
  async (seed, globalSalt, collectionAddress, tokenId) =>
    eftAesDerivationAux(hkdfSha512, seed, globalSalt, collectionAddress, tokenId)

export const eftRsaDerivationNative = (crypto: Crypto): EftRsaDerivationFunction =>
  async (seed, globalSalt, collectionAddress, tokenId, dealNumber) =>
    eftRsaDerivationAux(hkdfSha512Native(crypto), seed, globalSalt, collectionAddress, tokenId, dealNumber)

export const eftRsaDerivation: EftRsaDerivationFunction =
  async (seed, globalSalt, collectionAddress, tokenId, dealNumber) =>
    eftRsaDerivationAux(hkdfSha512, seed, globalSalt, collectionAddress, tokenId, dealNumber)

const eftAesDerivationAux = async (
  hkdf: HkdfFunction, seed: ArrayBuffer, globalSalt: ArrayBuffer, collectionAddress: ArrayBuffer, tokenId: number
): Promise<AesKeyAndIv> => {
  const OKM = await hkdf(
    globalSalt,
    seed,
    Buffer.concat([
      aesKeyType,
      Buffer.from(collectionAddress),
      numberToBuffer(tokenId)]),
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
      numberToBuffer(tokenId),
      numberToBuffer(dealNumber)]),
    rsaModulusLength,
  )

  return new Promise((resolve, reject) => {
    const rsaWorker = new Worker(rsaWorkerUrl, { type: 'module' })
    rsaWorker.addEventListener('error', console.error)
    rsaWorker.addEventListener('message', console.log)
    rsaWorker.onmessage = (e) => resolve(e.data)
    rsaWorker.onerror = (e) => {
      console.error(e)
      reject(e)
    }

    rsaWorker.postMessage({ seed: OKM })
  })
}

