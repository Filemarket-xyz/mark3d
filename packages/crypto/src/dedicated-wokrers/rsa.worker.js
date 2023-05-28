import { rsaGenerateKeyPair } from '../lib/rsa'
// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')

self.onmessage = ({ data }) => {
  rsaGenerateKeyPair(data.seed)
    .then((keyPair) => self.postMessage(keyPair))
    // .then(() => self.close())
}

self.addEventListener("unhandledrejection", event => {
  postMessage({type: "error", error: event.reason});
  event.preventDefault();
});
