import forge from 'node-forge'
import { rsaGenerateKeyPair } from './rsa'

const seed = Buffer.from('6ad11397c28a06a829235286787490e70c4913ff970a42e15872fa93b81f7c81ca5d04245ca52cd918fbca633c3942f879f7938422af581fe66be36155c321442baf0ede13053b916b902c1ed4284955a8a546ff17c663de25cb658a8686610620666340f34edb8297c93d80dde6e9ef26256aad30a3a143bec0d230af8daaf39f4724de4d44e6683f0b4bec3701917404ded77b819d03de4bd69a0b5f28d5cf9a1a3ecf97ccc74ccf811810600cd1fd3728ab032fc71970fb424f88674fb3697a15434b7b54c6246d4856565a5324cae7ba69e9c0cf971b75dfa9f62a257b1f0a08d6f9a203f4143daab3057ffd626226e8ef13d1b9538d2c99f3825569c90287212b15debee1ffea134340fa45eec449cee4ea0122bd984ef9891c587e6a5fcc9caa7d0cb263b665187700bbb8767d696766b1c60bab32ec8bd6e1057f06b73b1d77a9f22cd46eae9a28beb58ec727213346b630789ece2f3a8f38dacbee0b7b3add351f2faa016db273acd20873399e8e59402e1b1ad732685b593d8a932d8acff5d6437035615884e781269c16d7c69a569c7cab9f196127af03684838a95870f86df507d538fe934c2fb9fde2ced977bf79fd4eac3c664b6ed344f0950695d85b5e1aab64044bcd3a92041a1c8a9a183403ce90b6e7685ce75e7a5a36f9225e8bf000ff7e0a06f4c53bf0a9e3b338246a84285b307bb64064e8e3f87266', 'hex')
const v = new forge.jsbn.BigInteger('29014889910085105719695876611287789646707592113041437579439716676332991316153323449250935021014162789997517209904134745318031937332383983914021176074820950097885977614733168314415328819171949784642244174449021523332884672095844294492510344383550502959131088400555863796380876530214581356583051441720320679630871972844784034085890658285186854395091268112223738333193329714438372044195109512810692060742038175695982402209606230784227332430339403713371993809924564018217219806570036375619179578762297635629649593037690576830180287311234633725087085052939845567191889516059688763271503373721571997545388714529974010595909')
const e = new forge.jsbn.BigInteger('15225725517637038139857947313978756142610502619297208735987192354487722386186504443806769112592248243411189657576711656591125678166035470972723982788298064301620697788384667492743596247814590342538180226500126714781674077536016761005881097165695096919719721991507099606719984292269543632647190721085251404857108747914221470084226361373560308615520960673673024436180900482397291090995153122040899561966976805106065139543134656789112474053752659209242154522498934948543129311403692344936504162445410771500835684307985962223418228186019503615762901680684361722526251246693428546617808088403219328621850075163482111055173')
const m = new forge.jsbn.BigInteger('15225725517637038139857947313978756142610502619297208735987192354487722386186504443806769112592248243411189657576711656591125678166035470972723982788298064301620697788384667492743596247814590342538180226500126714781674077536016761005881097165695096919719721991507099606719984292269543632647190721085251404857108747914221470084226361373560308615520960673673024436180900482397291090995153122040899561966976805106065139543134656789112474053752659209242154522498934948543129311403692344936504162445410771500835684307985962223418228186019503615762901680684361722526251246693428546617808088403219328621850075163482111055173')

function modPow(v: forge.jsbn.BigInteger, e: forge.jsbn.BigInteger, m: forge.jsbn.BigInteger) {
  console.time('modPow copyBigInt')
  var value = BigInt(v.toString())
  var exponent = BigInt(e.toString())
  var modulus = BigInt(m.toString())
  var result = 1n;
  console.timeEnd('modPow copyBigInt')
  
  value = value % modulus;

  console.time('modPow exponent')
  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * value) % modulus;
    }
    exponent = exponent >> 1n;
    value = (value * value) % modulus;
  }
  console.timeEnd('modPow exponent')
  
  console.time('modPow bigintToJsbn')
  const resultJsbn = new forge.jsbn.BigInteger(result.toString());
  console.timeEnd('modPow bigintToJsbn')

  return resultJsbn
}

// async function modPowWasm(v: forge.jsbn.BigInteger, e: forge.jsbn.BigInteger, m: forge.jsbn.BigInteger) {
//   console.time('modPowWasm gmpInit')
//   const { binding } = await gmp.init()
//   console.timeEnd('modPowWasm gmpInit')

//   console.time('modPowWasm gmpCopyStrings')
//   const resultGmp = binding.mpz_t();
//   const valueNumPtr = binding.mpz_t()
//   const exponentNumPtr = binding.mpz_t()
//   const modulusNumPtr = binding.mpz_t()
//   const valueStrPtr = binding.malloc_cstr(v.toString(16))
//   const exponentStrPtr = binding.malloc_cstr(e.toString(16))
//   const modulusStrPtr = binding.malloc_cstr(m.toString(16))
//   console.timeEnd('modPowWasm gmpCopyStrings')

//   console.time('modPowWasm gmpInitNumbers')
//   binding.mpz_init_set_str(valueNumPtr, valueStrPtr, 16);
//   binding.mpz_init_set_str(exponentNumPtr, exponentStrPtr, 16);
//   binding.mpz_init_set_str(modulusNumPtr, modulusStrPtr, 16);
//   console.timeEnd('modPowWasm gmpInitNumbers')

//   console.time('modPowWasm gmpModPow')
//   binding.mpz_powm(resultGmp, valueNumPtr, exponentNumPtr, modulusNumPtr);
//   console.timeEnd('modPowWasm gmpModPow')

//   console.time('modPowWasm gmpToJSBN')
//   const resultJsbn = new forge.jsbn.BigInteger(binding.mpz_to_string(resultGmp, 16), 16);
//   console.timeEnd('modPowWasm gmpToJSBN')

//   console.time('gmpFreeMem')
//   binding.free(valueStrPtr)
//   binding.free(modulusStrPtr)
//   binding.free(exponentStrPtr)

//   binding.mpz_clears(resultGmp, modulusNumPtr, exponentNumPtr, valueNumPtr)
//   binding.mpz_t_frees(resultGmp, modulusNumPtr, exponentNumPtr, valueNumPtr)
//   console.timeEnd('gmpFreeMem')

//   return resultJsbn
// }

describe('benchmark', () => {
  it('modPow bigint', async () => {
  console.time('modPow bigint')
  modPow(v, e, m)
  console.timeEnd('modPow bigint')
  })
  // it('modPow wasm', async () => {
  // console.time('modPow wasm')
  // modPowWasm(v, e, m)
  // console.timeEnd('modPow wasm')
  // })
  it('rsaGenerateKeyPair', async () => {
    console.time('rsaGenerateKeyPair')
    rsaGenerateKeyPair(seed)
    console.timeEnd('rsaGenerateKeyPair')
  })
})
