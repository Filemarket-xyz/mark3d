import { rsaGenerateKeyPair } from '../lib/rsa'

self.onmessage = ({ data }) => {
  rsaGenerateKeyPair(data.seed)
    .then((keyPair) => self.postMessage(keyPair))
    .then(() => self.close())
}
