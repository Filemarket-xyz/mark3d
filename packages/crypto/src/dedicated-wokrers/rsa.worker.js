import { rsaGenerateKeyPair } from '../lib/rsa'
self.postMessage(1)
// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')
self.postMessage(2)


self.postMessage(3)
self.onmessage = ({ data }) => {
  self.postMessage(4)
  rsaGenerateKeyPair(data.seed)
  .then((keyPair) => self.postMessage(keyPair))
  .then(() => self.close())
  self.postMessage(5)
}

self.postMessage(6)
self.addEventListener("unhandledRejection", event => {
  throw new Error(event.reason)
});
self.postMessage(7)
