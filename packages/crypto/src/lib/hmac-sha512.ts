import {hmac, util} from 'node-forge';
import {HmacFunction} from './types';

export const hmacSha512: HmacFunction = async (key: ArrayBuffer, payload: ArrayBuffer): Promise<ArrayBuffer> => {
  const hash = hmac.create()
  hash.start('sha512', new util.ByteStringBuffer(key))
  hash.update(Buffer.from(payload).toString('binary'))
  return Buffer.from(hash.digest().toHex(), 'hex')
}

export const hmacSha512Native = (crypto: Crypto): HmacFunction => async (key: ArrayBuffer, payload: ArrayBuffer): Promise<ArrayBuffer> => {
  const nativeKey = await crypto
    .subtle
    .importKey('raw', key, {
        name: 'HMAC',
        hash: 'SHA-512'
      },
      false,
      ['sign', 'verify']
    )
  return await window
    .crypto
    .subtle
    .sign('HMAC', nativeKey, payload)
}
