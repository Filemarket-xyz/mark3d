import {hmacSha512} from './hmac-sha512';

describe('hmac-sha512', () => {
  it('should equal crypto.subtle hmac-sha512', async () => {
    const key = Buffer.from([1, 2, 3])
    const data = Buffer.from([4, 5, 6])
    const nativeKey = await window.crypto.subtle.importKey('raw', key, {name: 'HMAC', hash: 'SHA-512'}, false, ['sign', 'verify' ])
    const nativeHmac = await window.crypto.subtle.sign('HMAC', nativeKey, data)
    const forgeHmac = await hmacSha512(key, data)
    expect(Buffer.from(nativeHmac).toString('hex'))
      .toEqual(Buffer.from(forgeHmac).toString('hex'))
  })
})
