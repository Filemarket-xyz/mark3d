// import { rsaGenerateKeyPair } from '../lib/rsa'
// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')

self.onmessage = ({ data }) => {
  import('../lib/rsa')
    .then(({ rsaGenerateKeyPair }) => rsaGenerateKeyPair(data.seed))
    .then((keyPair) => self.postMessage(keyPair))
    .then(() => self.close())
}

self.addEventListener("unhandledRejection", event => {
  throw new Error(JSON.stringify(event))
});

