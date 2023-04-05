import {hmacSha512, hmacSha512Native} from './hmac-sha512';
import {buf2Hex} from './utils';

describe('hmac-sha512', () => {
  it('should equal crypto.subtle hmac-sha512 on small data', async () => {
    const key = Buffer.from([1, 2, 3])
    const data = Buffer.from([4, 5, 6])
    const nativeHmac = await hmacSha512Native(window.crypto)(key, data)
    const forgeHmac = await hmacSha512(key, data)
    expect(buf2Hex(nativeHmac))
      .toEqual(buf2Hex(forgeHmac))
  })
  it('should equal crypto.subtle hmac-sha512 on big data', async () => {
    const key = Buffer.from('348effc75fba0a8fa07655d1c140959d9754e7bd31a85447f74a843c879c55a5e9b11a8a51db32bd1aaec66b1a44bc7229cf2507cc2c060a358a7bd040c60c94', 'hex')
    const data = Buffer.from('0ae2b1f91d3791c31941c3ca349222a37c9bed064c590682f6ca52fd9b3cd6b4bf57a0466bde7e6e4370bdea5bdfa2212e36b847cd8e2df1a8980889cd52a8026b2daffd445304f8ff9c46b718a5983e293c9f94cfe8d2a058a9d8da9472c8a95b61513c1f5804b6202734d4ab09b9bd2e22af713885e9b0722bba3d752431e4', 'hex')
    const hmac = Buffer.from('29af59ca3aaddfb3e44f4f7d45a74f1132a331192300da69989cff2240cf1969db9293900e5881b53975474d673d7e94a3eeec610a53c492987c49eb60fa3ed5', 'hex')
    const nativeHmac = await hmacSha512Native(window.crypto)(key, data)
    const forgeHmac = await hmacSha512(key, data)
    expect(buf2Hex(nativeHmac))
      .toEqual(buf2Hex(forgeHmac))
    expect(buf2Hex(hmac)).toEqual(buf2Hex(nativeHmac))
  })
})
