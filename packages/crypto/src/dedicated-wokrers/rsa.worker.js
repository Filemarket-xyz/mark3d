import { rsaGenerateKeyPair } from '../lib/rsa'
console.log(1)
// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')
console.log(2)


console.log(3)
self.onmessage = ({ data }) => {
  console.log(4)
  rsaGenerateKeyPair(data.seed)
  .then((keyPair) => self.postMessage(keyPair))
  .then(() => self.close())
  console.log(5)
}

console.log(6)
self.addEventListener("unhandledRejection", event => {
  throw new Error(event.reason)
});
console.log(7)
