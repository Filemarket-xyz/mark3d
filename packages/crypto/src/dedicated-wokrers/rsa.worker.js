self.onmessage = async ({ data }) => {
  const {pki, random, asn1} = await import('node-forge')
  const {Buffer} = await import('buffer')

  const rsaGenerateKeyPair = async (seed) => {
    const seedHex = Buffer.from(seed).toString('hex')
    // seed pseudo random number generation
    const prng = random.createInstance();
    prng.seedFileSync = () => seedHex
    // workers 0 is necessary for deterministic key generation
    const key = pki.rsa.generateKeyPair({bits: 4096, workers: 0, prng})

    return {
      pub: rsaPublicSubjectKeyInfoToBytes(key.publicKey),
      priv: rsaPrivateKeyPKCS8ToBytes(key.privateKey),
    }
  }

  const rsaPrivateKeyPKCS8ToBytes = (privateKey) => {
    const privateKeyAsn1 = pki.privateKeyToAsn1(privateKey);
    // privateKey comes without additional info about it and window.crypto.importKey can't recognize it
    // so we need to wrap this privateKey in ASN.1 object with additional data (version, algorithmId)
    const privateKeyInfoAsn1 = pki.wrapRsaPrivateKey(privateKeyAsn1);
    const privateKeyDer = asn1.toDer(privateKeyInfoAsn1);

    return Buffer.from(privateKeyDer.toHex(), 'hex')
  }

  const rsaPublicSubjectKeyInfoToBytes = (publicKey) => {
    const publicKeyAsn1 = pki.publicKeyToAsn1(publicKey);
    const publicKeyDer = asn1.toDer(publicKeyAsn1);

    return Buffer.from(publicKeyDer.toHex(), 'hex')
  }

  const keyPair = await rsaGenerateKeyPair(data.seed)
  self.postMessage(keyPair)

  self.close()
}

self.addEventListener("unhandledRejection", event => {
  throw new Error(JSON.stringify(event))
});

// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')

