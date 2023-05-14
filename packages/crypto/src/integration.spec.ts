import {FileMarketCrypto} from './index';
import {bufferToHex} from './lib/utils';

const globalSalt = Buffer.from('137d63f71265a151c69a5158e20675b51ae359133fdcace8a7294b7af2f0d05d4561d8ea180b6698abb70ff110376517c6ad7968090c2d576b3dbf208af4e841', 'hex')
const address = '0x736367086A8920EF71C1F68a11e6CeB8b6026a13'
const addressBuffer = Buffer.from(address.slice(2))
const seed = Buffer.from('94d7d898760df59af1097d7b34bd9d09', 'hex')
describe('full cycle', () => {
  let fc: FileMarketCrypto
  beforeEach(() => {
    fc = new FileMarketCrypto(window.crypto)
  })
  it('should work', async () => {
    const {key: generatedPassword} = await fc.eftAesDerivation(seed, globalSalt, addressBuffer, 0)
    const {priv, pub} = await fc.eftRsaDerivation(seed, globalSalt, addressBuffer, 0, 0)
    const encryptedPassword = await fc.rsaEncrypt(generatedPassword, pub)
    const decryptedPassword = await fc.rsaDecrypt(encryptedPassword, priv)
    expect(bufferToHex(decryptedPassword))
      .toEqual(bufferToHex(generatedPassword))
  })
})
