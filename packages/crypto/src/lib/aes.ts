import {AesKey, AesKeyAndIv} from './types';
import * as Crypto from 'crypto';
import {sha512Native} from './sha512';
import {aesIVLength, hashLength} from './config';
import {bufferToHex} from './utils';

export const aesEncryptNative = (crypto: Crypto) =>
  async (data: ArrayBuffer, keyAndIv: AesKeyAndIv) => {
    const key = await crypto.subtle.importKey(
      'raw',
      keyAndIv.key,
      {
        name: 'AES-CBC',
      },
      false,
      ['encrypt']
    )
    const hash = await sha512Native(crypto)(data)
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: keyAndIv.iv,
      },
      key,
      data
    )
    return Buffer.concat([
      Buffer.from(keyAndIv.iv),
      Buffer.from(hash),
      Buffer.from(encryptedData)
    ])
  }

export const aesDecryptNative = (crypto: Crypto) =>
  async (data: ArrayBuffer, key: AesKey) => {
    if (data.byteLength < (aesIVLength + hashLength) / 8) {
      throw Error('too small data to encrypt')
    }
    const ivEnd = aesIVLength / 8;
    const iv = data.slice(0, ivEnd);
    const hashEnd = ivEnd + hashLength / 8;
    const hash = data.slice(ivEnd, hashEnd)
    const message = data.slice(hashEnd)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      {
        name: 'AES-CBC',
      },
      false,
      ['decrypt']
    )
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      cryptoKey,
      message
    )
    const hashDecrypted = await sha512Native(crypto)(decryptedData)
    if (bufferToHex(hashDecrypted) !== bufferToHex(hash)) {
      throw Error('Decrypted data hash does not match')
    }
    return decryptedData
  }
