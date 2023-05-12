import { rsaGenerateKeyPair } from './rsa'

self.onmessage = ({ data }: MessageEvent<{ seed: ArrayBuffer }>) => {
  rsaGenerateKeyPair(data.seed)
    .then((keyPair) => self.postMessage(keyPair))
    .then(() => self.close())
}