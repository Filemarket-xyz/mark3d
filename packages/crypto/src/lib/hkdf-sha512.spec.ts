import {hkdfSha512, hkdfSha512Native, hkdfSha512NativeHash} from './hkdf-sha512';

const salt = Buffer.from('137d63f71265a151c69a5158e20675b51ae359133fdcace8a7294b7af2f0d05d4561d8ea180b6698abb70ff110376517c6ad7968090c2d576b3dbf208af4e841', 'hex')
const IKM = Buffer.from('9585eeb46b69b33872de8c5ae0111162', 'hex')

describe('hkdf-sha512', () => {
  it('should equal crypto.subtle hkdf-sha512', async () => {
    const info = Buffer.from([4, 5, 6, 7])
    const len = 1024;
    const derivedNative = Buffer.from(await hkdfSha512Native(window.crypto)(salt, IKM, info, len))
    const derivedNativeHash = Buffer.from(await hkdfSha512NativeHash(window.crypto)(salt, IKM, info, len))
    const derived = Buffer.from(await hkdfSha512(salt, IKM, info, len))
    expect(derivedNative).toEqual(derived)
    expect(derivedNativeHash).toEqual(derived)
  })
})
