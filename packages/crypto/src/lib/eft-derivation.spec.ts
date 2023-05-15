import {eftAesDerivation, eftAesDerivationNative, eftRsaDerivation, eftRsaDerivationNative} from './eft-derivation';
import {RsaKeyPair} from './types';
import {bufferToHex} from './utils';

const globalSalt = Buffer.from('137d63f71265a151c69a5158e20675b51ae359133fdcace8a7294b7af2f0d05d4561d8ea180b6698abb70ff110376517c6ad7968090c2d576b3dbf208af4e841', 'hex')
const address = '0x736367086A8920EF71C1F68a11e6CeB8b6026a13'
const seed = Buffer.from('94d7d898760df59af1097d7b34bd9d09', 'hex')

const rsaPreDerived: RsaKeyPair = {
  pub: Buffer.from('30820222300d06092a864886f70d01010105000382020f003082020a02820201009cd884f1d5e7bc477ece41efdb093eff91b8a60b52ae57feef94d8fb331f77cce63b2c0b38cba3310d114ae72c24aa98d1e8641878a2b8a112601c18e77930bf2b463bbc55bebb87b99856e64aa7898c1d1401722679d6c761bb980c91f189a65851bcc2608ad10f52ce4eb2b92661b9c934626f69da6d3115f97e1950f3ffb57e463d4770f16182128e7e0e1e32ec4624bcaebcaf5a829739acc431b4218c10d49a917ec580c9069add2289447c98d5b04bd41ccda3ee56d5103e7375e406968f80687497b3dae1aece7dfeeefc87faf00414d48429e00771c233bd29dfef86a359b97fce3fc18ac0e3f134f7ccb6863263b8e579067f6e76c0dd479310373c20a14cd4cfbd13af0601af3b9de1a58575ff0c60f7aa67f163e7bf95d5989d6f807cdf652e39e4a111bc51fcca02d764f8883d61374eec16bcb87429eeba18b60c6b776def1cc95afccdbc7a4d3d659353672f0eee054551f69d87a8e766c8445fb7980b1ceb78e9cdeb88b6a2ac23c68e9a857c4ddb31488b6526d4096285d96da7e86289ebba4788381777157a89e01e2907809b81d184e108a32792f58930973dcd223e568905b61a1d2f6d37c1073b8a892d373af00e4bd20df8ffd9abc3a5cf7070a95a391b0850f0c8d4a37b9f1e1e74dcefef3035ab3ac9a5ee21ba6b824970b209fd71a18ce01c6eed455c1723785d4e985b66ac349bfca4deb9a9050203010001', 'hex'),
  priv: Buffer.from('30820941020100300d06092a864886f70d01010105000482092b3082092702010002820201009cd884f1d5e7bc477ece41efdb093eff91b8a60b52ae57feef94d8fb331f77cce63b2c0b38cba3310d114ae72c24aa98d1e8641878a2b8a112601c18e77930bf2b463bbc55bebb87b99856e64aa7898c1d1401722679d6c761bb980c91f189a65851bcc2608ad10f52ce4eb2b92661b9c934626f69da6d3115f97e1950f3ffb57e463d4770f16182128e7e0e1e32ec4624bcaebcaf5a829739acc431b4218c10d49a917ec580c9069add2289447c98d5b04bd41ccda3ee56d5103e7375e406968f80687497b3dae1aece7dfeeefc87faf00414d48429e00771c233bd29dfef86a359b97fce3fc18ac0e3f134f7ccb6863263b8e579067f6e76c0dd479310373c20a14cd4cfbd13af0601af3b9de1a58575ff0c60f7aa67f163e7bf95d5989d6f807cdf652e39e4a111bc51fcca02d764f8883d61374eec16bcb87429eeba18b60c6b776def1cc95afccdbc7a4d3d659353672f0eee054551f69d87a8e766c8445fb7980b1ceb78e9cdeb88b6a2ac23c68e9a857c4ddb31488b6526d4096285d96da7e86289ebba4788381777157a89e01e2907809b81d184e108a32792f58930973dcd223e568905b61a1d2f6d37c1073b8a892d373af00e4bd20df8ffd9abc3a5cf7070a95a391b0850f0c8d4a37b9f1e1e74dcefef3035ab3ac9a5ee21ba6b824970b209fd71a18ce01c6eed455c1723785d4e985b66ac349bfca4deb9a90502030100010282020059b6872484c38e301ed9ff61209a434c8f9f5c6a719a837eb0af25055a128fc5c592e6f86c3e1e53fa337ff2868f5a7d1ae3a00d57434bf3e5bccf9577211cbedc13ca2b49a8553fa6eafa19b36ded0115c8d1a2e75b1d7ce1ec1966673c0f0df4ca9bfb5a994c474587f7ffc663abd646be0de7c85645caa3d5174987c268eaf915580bbb1076439e359ee898616c401ad749e36731902ccbb2846e21a866a361d81f8cb18f9e6c86bc21fafe0f7ea40bb8f3d49dd33c8ab2481e50908823348f54556b0b32b6ea0bc0d4d4b302030d87a7edfa38b6730c0f0793ec893d2b96896cd2ebc59f36271579cc080e0d2c01ca64bbe795b81fbfa17163a082ffed7732cfa9e8a553bd29a17aea658231c40a25a96f5689be1313beb3abd1d1444613f086e29e4e595de27e3b94cf55f5838c7e10f75d41a6778dfeee4933c49185cdcb545ae1857fb201a7de076242886e866be3ec689e216b54630aa4bb3ba590c8544fbd36880beb26741f1eacaf025bc043cd22881df0eb2f9ce9f8fbd636c96654e0168e9a12680d83506c7e3e86f885e6de5860eeb7aac995d23ec923f071f941de4c1a3098b565ae4b253c8eccc370b53a5cc11c1470ae4a139b29d7b3d6e6f4365fd7fc23ce6fa7260196c37f941dc57d7055902c8af85100e543f9d0af2c2a8afd0a88153620695cfba41dc17cf61cc0e85362d7297d12e73dd23a0fe1810282010100db54686a66ba389ba2b4fec5c9ec88782d70e77a1ac621183828239284ffe0518f452242583ff2fdbd78b0c574b9f8ee09675a09624e4f1ae17aaf6a232eb30e10b6f3da56572c2faa1942ffb872aa19b850a485b29ed7336363d92ba160566a347abb2033a62f48d6d6b0ad5d1b8e9a316523535a7dc8a8523a5816900c219643ed10d91c60b9cdc55c7b0b93e083ec682e8730112607a69f4b8641ace2e9261cc4e77622c2ccebe6b5b2282cb56db8800b381a91d9934bb594d3a8c32ee364a888ccebff026d6a56f844a56ee71b147536a4f06ea4f060be5eb69f2940724ef91dad7002ae5ef57b208d99c9e6825d0b17178bd2d0f720a254907a1316da910282010100b711b8108afd9f099e22e8b3ea47c251cbd0cddb5767566492035d8773e72effe03c130a1b837f1270905e8e85f89d8bc78ccea627fe2ffc823a33ea3143829de1c449bbe2f4cb25dfcc7a3de23b02d5a22ca6f120c79296b9cda89a7901b3cbbcf58739076269b23c01399609a6dabb3f7debcd14af338baaabef6295244b8f6e0865fd543d9cc186e2551050cab1d9df8d9812519e090b25dceed1956c2ba1d41d973a84f91b921321e79be1ff5364a2cf29fc6b055a9c5a0c1386f95c4c166a1c649065ea66be9293858547abda611990cf26f22d1f2b26ae6291341c1a10264a27d4078e75d5bea40e810c1ce7166d9d8331c787f996e0be99df35e259350282010055cd3183de681f59134fc7134d2911422254b6d957bc069a58edaaecd8c6d8d44f3df66709eb0a7e252f1fc83f1fb9b835498f397891b5f4881cdc9ea2e0d3ff3e9eb3cac85815db17aa0641cfc05bb6f019ec22b97bd6282e4b935bb427e1e66e5d4cf30e018721f199cf4822d272f8f335e399ea1ea6eee22c1ce5c6b8583356a35921f62e08c1ece17ee94a925c4991801236c59ea10397f18db60792452f39b5f5ee8b2eb5c7db5b5d34c638bb919fd5c3bef12bb2a9bd815943fe074bc1c704ad55ed4edfcae7f6fbb3d42ce8b51a1da46cc27c17e560d3e091672be50bebfca62ad981a9785310ab146c9d96861b9e8f018e195d7410cd10301163b1610282010064595e2013503ae136c1c3f4fb33229d5bafb567ca5d66c9f20fce30f5a37febdaaa937532e7bdbc09dfd9351ed2cce95615252187429a633baf53cdc7fb4d99e5ab870f6ab4ecb6721acfd7242f5cba660f3be369287c7e0a93651c67c03b222f0e1775774ac6cd607efb65f71c7341b8e7f95d8d3d0c703eb9c89aad4e1bed1f4f93386df8e7f85d4bab7d2a0c31b95005799a710ac3c24c9af27e07fe275ca9bd1eac813f5b9192d33ef5ffc7c99a9c741a7bb6de5470e81b3e88fa1f51c5e79c70b3866a1aafd400f16bc181be4f03889144b3f36fe66369abb6146e630aff321eeae6c97c6611fe33c52132a6a970a4aac99aaa3a722df7ccb8c1fcb51102820100009e851050b8f2718d5f15ef46ebd1be4bd97562d5d610183a7e56b6d955139e7ef54c57251349ed0f35f655e08c4126d18e4f72cc29ad62cd6d601e32fd640fba305329d78f72ba0db1a4e38b607358da97a89208774770a4b1ff0f476aa6770650e19833c8b16718f6f0bb8851cfee54ad40459e87166bb02de868cd664da8d133fe83683752a3eda885c2ea2abd0b33449981f710b23e94ed00b6958f8244d2e59a95716b863ebd22cf9fbfe6f148f7cbf01bdb8cd734d6e295f21ba9844ff61099db4d06239ea26a5529dc9d5d1038953d9df779fd164f1f6ca06b9c3be26994e0e494fa07cd007142f5dae607d3f5c6329728b8ea8e3b8378cf9d591ef3', 'hex')
}

describe('eft-derivation', () => {
  describe('aes', () => {
    it('should be the same as native', async () => {
      const collectionAddress = Buffer.from(address.slice(2), 'hex')
      const tokenId = 8;
      const derivedKey = await eftAesDerivation(seed, globalSalt, collectionAddress, tokenId)
      const derivedKeyNative = await eftAesDerivationNative(window.crypto)(seed, globalSalt, collectionAddress, tokenId)
      expect(bufferToHex(derivedKey.key))
        .toEqual(bufferToHex(derivedKeyNative.key))
      expect(Buffer.from(derivedKey.iv).toString('hex'))
        .toEqual(Buffer.from(derivedKeyNative.iv).toString('hex'))
      expect(derivedKey.key.byteLength).toEqual(256/8)
      expect(derivedKey.iv.byteLength).toEqual(16)
    })
  })
  describe('rsa', () => {
    it('should derive keys', async () => {
      const collectionAddress = Buffer.from(address.slice(2), 'hex')
      const tokenId = 1;
      const dealNumber = 2;
      const derivedKey = await eftRsaDerivation(seed, globalSalt, collectionAddress, tokenId, dealNumber)
      expect(bufferToHex(derivedKey.pub))
        .toEqual(bufferToHex(rsaPreDerived.pub))
      expect(bufferToHex(derivedKey.priv))
        .toEqual(bufferToHex(rsaPreDerived.priv))
    })
    it('should derive the same keys natively', async () => {
      const collectionAddress = Buffer.from(address.slice(2), 'hex')
      const tokenId = 1;
      const dealNumber = 2;
      const derivedKey = await eftRsaDerivationNative(window.crypto)(seed, globalSalt, collectionAddress, tokenId, dealNumber)
      // const derivedKeyNative = await eftRsaDerivationNative(window.crypto)(seed, globalSalt, collectionAddress, dealNumber)
      expect(bufferToHex(derivedKey.pub))
        .toEqual(bufferToHex(rsaPreDerived.pub))
      expect(bufferToHex(derivedKey.priv))
        .toEqual(bufferToHex(rsaPreDerived.priv))
    })
  })
})
