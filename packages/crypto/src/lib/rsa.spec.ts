import {rsaDecryptNative, rsaEncryptNative, rsaGenerateKeyPair} from './rsa';
import {buf2Hex, removeSpaces} from './utils';

const SEED = Buffer.from(
  '6541c1895ad24fe201e0439ce152a6fda82eb2db0fdac6866336719ef932010bdf28f443f049dd05574940f8d5c00f0474f1e4b889c78cd5cf17f5db66dff2f7a8ef2ed70ca09d3d8d58396160ea2cde750cb783fc5c60317f410fdfe80d163f6b55685ee93ec0321b844545377c12e2c641ac6efd63ac379d9cf4fd9108e7dc8a62260142d2443c5fc51b26ff5574471091ec7dd796199c76ca8d40be595407c88438155e3171df99fd5725e0bf1997b81207230265e0ace18815c6b98e05bf975ba3837fa7e8cfbe75e9738db09235e0eb6f6502834a5dd691b3dcce81fb616a982f9c13419d366911721082dcf972c786f14def1e5d8ec19f827ee5909989af59f2223a1fe802c7f99f25eea75a2e7105de2d45f652b23dfdb5adf8093b71313f01592c224bd8a80861b2a445443f22f734b1b8b8f8de4c3988534ac31f6cf6e726fbea4b2c6fd59a3bc5184067ecda18b2b28b89bb32c08de8eb300f785d7108ecd7c2c45763fa4cef783c662becde071afc027cef2c9de353c2b545c2241437ab302de1a9693d12cb2e3c27e3d600f965771583fc6393537a4856c2cfc5c0b26a989a3202f6f50a2c44cf6b3d93e15bf3a9d7046da771b97437d9baa18a9b552e83e03782af7e97d9c15184d17a9019633f2017ad5978d4c2c16dca725f310eb984f75f25773350c2c38f8c920f714eac05e9b7194aaa57ba0707eb0de7',
  'hex'
)

const preGeneratedKey = removeSpaces(`
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`)

const preGeneratedPubHex = '30820222300d06092a864886f70d01010105000382020f003082020a0282020100959ecdc6f0d50a4fb0a85e45cc0d978d721f3e6bcf8ada535f8b6759e899dc78097c3f92f0953deae5d1b6ab5d4c35beb5a80b1935a2fab3ef624a8df61c07f3a9cf4b6ad6fe0db869f2aad3368aa72781ebf4ad20851cb21e5189015a75b3c2707a42cb1a682b7390cd94626f76ebc38760fefdc255e9b519ab084a26194fd0d9b91b5a8d31a2c94871006a4e209c39d9fbb6acf454dd4760ffd5e81f872f6c7fb8d2b641aa4c7b5660ab8de397ffab78da61ba088246f8e25496084bebc1326ed332f67f79575911a477276f5f19c607c1f795a2fc440bfdcc37f1575713f13d51b5371bf2b67cce115ffd1c0bc6bbaffda24dda66d914896e01c7b1806c3aa0f4e7aa4538624a1b909b738dbe4ac69609fbf93bc30f1f4132799019d964344a1c79605b852d0541cc7a8c3eb2ca94d864ad679d6f08dc53d864591509ea093631bd676dea6e2db18d41c1ab63b0d3181dfb33797d03e1fe2049663a60d531141d5e8a308e89f1c1bc46acf5a596ed66a81b6df97f062a77598c9b9b0d0f1108203be13b4b18cf8761edeb2f833267f1d807516b5c715f6d05ad67e083a0a335907d53810c024e377520e732cc925a75292ecba8c1b6f3882b91bbfdcfd9ed0c80840e3fede8066136182b37ddd70b35b53144b4d745d3072382ddd666a552f54f2d6a38fe0a6585d0d585ddd6b0ea2cc4d492115996a290b5948af05c869f0203010001'

const preGeneratedPrivHex = '30820943020100300d06092a864886f70d01010105000482092d308209290201000282020100959ecdc6f0d50a4fb0a85e45cc0d978d721f3e6bcf8ada535f8b6759e899dc78097c3f92f0953deae5d1b6ab5d4c35beb5a80b1935a2fab3ef624a8df61c07f3a9cf4b6ad6fe0db869f2aad3368aa72781ebf4ad20851cb21e5189015a75b3c2707a42cb1a682b7390cd94626f76ebc38760fefdc255e9b519ab084a26194fd0d9b91b5a8d31a2c94871006a4e209c39d9fbb6acf454dd4760ffd5e81f872f6c7fb8d2b641aa4c7b5660ab8de397ffab78da61ba088246f8e25496084bebc1326ed332f67f79575911a477276f5f19c607c1f795a2fc440bfdcc37f1575713f13d51b5371bf2b67cce115ffd1c0bc6bbaffda24dda66d914896e01c7b1806c3aa0f4e7aa4538624a1b909b738dbe4ac69609fbf93bc30f1f4132799019d964344a1c79605b852d0541cc7a8c3eb2ca94d864ad679d6f08dc53d864591509ea093631bd676dea6e2db18d41c1ab63b0d3181dfb33797d03e1fe2049663a60d531141d5e8a308e89f1c1bc46acf5a596ed66a81b6df97f062a77598c9b9b0d0f1108203be13b4b18cf8761edeb2f833267f1d807516b5c715f6d05ad67e083a0a335907d53810c024e377520e732cc925a75292ecba8c1b6f3882b91bbfdcfd9ed0c80840e3fede8066136182b37ddd70b35b53144b4d745d3072382ddd666a552f54f2d6a38fe0a6585d0d585ddd6b0ea2cc4d492115996a290b5948af05c869f0203010001028202006ee1eecca5c4accc9c365b0f4d0731aec0c9c8dfeb429344c0853685da2cd4c81cf778c1f40c168413e7d481b135fe8aa463b23def93264add78b199fdaf8e711502ac78b4763942d739e14180a546f5af8267a53a798be7b13269df97e3ace1c7abc3fe73468a152e563cc6aaa6ae590ce664733967a438f399de1ddd985a9f840b7beb22c28b4ab2a61451b42ed4b8c70495c01d9f1b12801f79ae7a571c5d43567cca5765d7227cc44dbf6cd143c8175b789b7f1cd56e3385ce5ebdad2d53abf0574f78ef3b3da62685abb30cfeb3d521f9d36aa39be66b23c2bdd8258f80f419aebbf5b96d6696ed277f141ee21c4c7422a9a1d720bfe88d9f421818fd9b55f139a3c78990253fc247bd334755727195a6a468e53bc1771f8a40e2c4dd44e037d107ba7d931e891cb1d50168581c086e251fbc9bc7ebdb6798e59bf8659cd843b2baf798a5a8d4a30430433107d2fab7a6fd85098f276138c8109bd9d2db8e46235b6d4ebeb0c276e7e4851fa725712dee2e0404d05e69dd275dfec7b7dc57fe67def3b254a05c580730e994efcaa68d0088f0dec1cd85cf6eae8d782eccb108206bb7ed9bce9a7e26f816aac62ad1b280e2485d3dbbb0c8a3c31dbec443be20bbdb756f65c533d1b26b694562f6b2371ec74a12d3a6440d57f7e6860b8f79fca74add9ed31517f34127f99b732f2cf1a7a4d8376db0944b5ae8f832ab510282010100fcd6ddc705699dc0d448a57ec5614e0c19e4d3f1f4ea65524eb5d9eb0a6f83ed6a3158b11f9da44b104f45563ff30a638a051afd564d582aa5f4de37c3440ba3522f68c02cbea98f11c2e8dd6d5882e03d42747c8a8c9f6c9d549f3cf1de1f96c584f48d16d0b1203bfd3a7199a27729209977450d9c9feb66e7b1c4d32755221b5f39cc102c504d8aaa57db9ac030ef36c7eec3580f4e36c460f52ac44f534dd025220f640bc93214c6787debe0f167e023ee647df3bc6490f7932ddfbe07ac34f705a3be26feb80a4411db8ef7b5abca9ffdee96b44151f185baed0a9d54bc6b71d5f4b269975fb38fc43595ba62b4c33a2fc3ba2fa597aa0788bd2fb6c1b90282010100977d9dffa473ea6c92ea3f6728f9a213851ef38d2f674a027be0764c472210d806ae93276c28509e57464d3b554e1bc43258e6c13213bc480344d68d3da61673c654d326785a823451f0d4a4f96d19ee0e3aac029e0bfeaf178a58c6fa1ec5327c818fc1b1ce0497181ff760cdb010888ef7882d5bc25459c12dbe6180ed46ab8444118e57a2e9473d0908a8f827ad531b069cfaebef56c7b2be1caf773d139e5063be3618a3e11081a3500334216c83ea8061814c7ce435dd4b8d5c1012233349dbfe467d5b02babca2f08559ac80be3abbf8669dc3bb8b6c1226993a91c67fe0525bbc7cd5f0f2f7a0c10d99f440debe33f0c0475176817ac2701dea959717028201003f9a3573e932a652699454bd4d1dab2a74211207dd9a511ea15a319564aca4bd46675f6e3f0bc2d67725d9c55694e6da1f502577f10bc7d002ab54732695a96fce2ecae4fcdc817ed1f2fbed27a28a59aa4f5b4a30f82aea81b155d558ea8d7bb9f836247fc6c3a7de2f575258597c2c465d1499b450e011b1733b4ecde7290d49616d029e56e7647a2b5baa8c85284a24b7aaa24d369c703e7a3d7222abe9c2bb477c07ef1cdfe1cf4415ef6734d0c556a6f3432843f5f23e5d6912b323f47e275cb4787a4f08e876fca4995c9f877dcd9ced9de51f37074c005e035f1630c8ad2697b1d467a7829582e6d2abf594faefd96546914187205dcf436083ee2f5102820101008c566a8ff0a111821377bdd4ab38d6d48e75e5d9dd182a8fb2827614a3b103399cb70ccb707ec87067195162addbf60d0337284dc13e5725bf217e40c9e39ad915da6ee12c8d6c215be766968e1a6bf3046b85fdc6bc05ebde3ae3933112604c2cdb39798e65f40aa4e6b81c8d6f95616c50136f319a0cda39034f62b4351b4ab8f4f5ee8f70f3fa72a873c5545e2d4ad7b680a652fb1dc151ec9c565077dc3cc4ec21c1ab81e5758d22e574924e84609054edff020490c4f5849027c11b8c506f13c5b3375da061ad6ea4b2642851fbe81d4a3885de55570b7ea5133e16dd748932c299126c7f1216246db353f3da447e9f4f6050b13ebf24220c0b2acdf9710282010100b2a37841f6b60084b432f8b1dab557d5c496a862a85a1d4804f672dd49e73b64e7ad6154c0716f1e12ec612a8c00068a143d03b2fe86943b4f7c42083369cdfb5bf8b8ea5dd5b9d7a4f8324f92a9989b28daca113ca3c361dc3bf61d99cc224a10a401f2f48e6a80aff7a2e27797e2a59dfd48df37b428e901f6803243da50a1d797d624b978518381f49f3005bc7693f5379c362b7147837d900f4c9802cb1ec39a4fb5e9afe2e3b6f814edd0e866d9b2291ae08e700f2f48466e6715c2e184459507d0055d1a3211a49dbed77a2e27bb0e9d6b6a21f03ca1718f3f5fb5646fcece7488c3d91b09c4a7ae1e2ce86302c4411b464cf9951fe8a67cc9f0018376'

const data = Buffer.from('34753d35a15d668891889027e835b382cb938b33f6af19744806700bc94c398e', 'hex')

describe('rsa', () => {
  it('should generate key', async () => {
    const key = await rsaGenerateKeyPair(SEED)
    console.log('key 12', buf2Hex(key.priv))
    expect(buf2Hex(key.priv)).toEqual(preGeneratedPrivHex)
    expect(buf2Hex(key.pub)).toEqual(preGeneratedPubHex)
  })
  it('should use all randomness', async () => {
    const key = await rsaGenerateKeyPair(SEED.subarray(0, SEED.length / 2))
    expect(Buffer.from(key.priv).toString('hex')).not.toEqual(preGeneratedKey)
  })
  it('should encrypt and decrypt data', async () => {
    const encrypted = await rsaEncryptNative(window.crypto)(data, Buffer.from(preGeneratedPubHex, 'hex'))
    const decrypted = await rsaDecryptNative(window.crypto)(encrypted, Buffer.from(preGeneratedPrivHex, 'hex'))
    expect(buf2Hex(decrypted)).toEqual(buf2Hex(data))
  })
})
