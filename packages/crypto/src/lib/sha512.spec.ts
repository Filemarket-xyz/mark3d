import {sha512, sha512Native} from './sha512';

const data = Buffer.from('4d64250faae772b6f789842ddda36bf9a3fbaa5c94ec0e8067d7c404a58762c8e5871e140399f4c934a653db6fb8c54a959ee63d84c5c2aea0bef923cc0de562', 'hex')

describe('sha512', () => {
  it('should equal crypto.subtle SHA512 on small data', async () => {
    const data = Buffer.from([1, 2, 3])
    const hashForgeHex = Buffer.from(await sha512(data)).toString('hex')
    const hashWebNative = await sha512Native(data)
    const hashWebNativeHex = Buffer.from(hashWebNative).toString('hex')
    expect(hashForgeHex).toEqual(hashWebNativeHex)
  })
  it('should equal crypto.subtle SHA512 on big data', async () => {
    const hashForgeHex = Buffer.from(await sha512(data)).toString('hex')
    const hashWebNative = await sha512Native(data)
    const hashWebNativeHex = Buffer.from(hashWebNative).toString('hex')
    expect(hashForgeHex).toEqual(hashWebNativeHex)
  })
  it('should equal crypto.subtle SHA512 on bigger data', async () => {
    const biggerData = Buffer.concat([data, data, data])
    const hashForgeHex = Buffer.from(await sha512(biggerData)).toString('hex')
    const hashWebNative = await sha512Native(biggerData)
    const hashWebNativeHex = Buffer.from(hashWebNative).toString('hex')
    expect(hashForgeHex).toEqual(hashWebNativeHex)
  })
})
