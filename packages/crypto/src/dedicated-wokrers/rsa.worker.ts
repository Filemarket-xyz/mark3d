self.onmessage = async ({ data }) => {
  const url =  new URL('../lib/rsa', import.meta.url)
  const { rsaGenerateKeyPair } = await import(url.href)

  const keyPair = await rsaGenerateKeyPair(data.seed)
  self.postMessage(keyPair)

  self.close()
}

self.addEventListener("unhandledRejection", event => {
  throw new Error(JSON.stringify(event))
});

// we should leave this in the js file to make the worker work both locally and in the prod version
// because of the file extension when creating the worker - new Worker('./path/to/worker.js')

