import {md} from 'node-forge';
import {HashFunction} from './types';

export const sha512: HashFunction = async (data: ArrayBuffer): Promise<ArrayBuffer> => {
  const hash = md.sha512.create();
  hash.update(Buffer.from(data).toString('binary'), 'raw')
  return Buffer.from(hash.digest().toHex(), 'hex')
}

export const sha512Native = (crypto: Crypto): HashFunction => async (data: ArrayBuffer): Promise<ArrayBuffer> => {
  return await crypto.subtle.digest('SHA-512', data)
}
