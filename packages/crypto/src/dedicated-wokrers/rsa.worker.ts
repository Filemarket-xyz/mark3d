import { rsaGenerateKeyPair } from '../lib/rsa'

self.onmessage = async ({ data }) => {
  const keyPair = await rsaGenerateKeyPair(data.seed)
  self.postMessage(keyPair)

  self.close()
}

self.addEventListener("unhandledRejection", event => {
  throw new Error(JSON.stringify(event))
});

