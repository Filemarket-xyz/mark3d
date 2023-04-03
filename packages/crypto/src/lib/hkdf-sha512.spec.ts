import {hkdfSha512, hkdfSha512Native, hkdfSha512NativeHash} from './hkdf-sha512';

const salt = Buffer.from('137d63f71265a151c69a5158e20675b51ae359133fdcace8a7294b7af2f0d05d4561d8ea180b6698abb70ff110376517c6ad7968090c2d576b3dbf208af4e841', 'hex')

describe('hkdf-sha512', () => {
  it('should equal crypto.subtle hkdf-sha512', async () => {
    const IKM = Buffer.from([1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    const info = Buffer.from([4, 5, 6, 7])
    const len = 1024;
    const derivedNative = Buffer.from(await hkdfSha512Native(salt, IKM, info, len))
    const derivedNativeHash = Buffer.from(await hkdfSha512NativeHash(salt, IKM, info, len))
    const derived = Buffer.from(await hkdfSha512(salt, IKM, info, len))
    expect(derivedNative).toEqual(derived)
    expect(derivedNativeHash).toEqual(derived)
  })
})
