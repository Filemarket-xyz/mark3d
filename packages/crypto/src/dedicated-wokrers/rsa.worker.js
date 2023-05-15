// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')
import { rsaGenerateKeyPair } from '../lib/rsa'

self.onmessage = ({ data }) => {
  rsaGenerateKeyPair(data.seed)
  .then((keyPair) => self.postMessage(keyPair))
  .then(() => self.close())
}
