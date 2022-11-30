import { getHttpLinkFromIpfsString } from '../utils/nfts/getHttpLinkFromIpfsString'

export class IPFSService {
  async fetchBytes(fileURI: string): Promise<Uint8Array> {
    console.log('fetch bytes', getHttpLinkFromIpfsString(fileURI))
    return await fetch(
      getHttpLinkFromIpfsString(fileURI), {
        method: 'GET',
        mode: 'cors'
      }).then(async resp => {
      if (resp.ok) {
        return await resp
          .arrayBuffer()
          .then(buffer => new Uint8Array(buffer))
      } else {
        return await resp
          .text()
          .then(text => {
            console.log('fetch bytes error', resp)
            throw new Error(text)
          })
      }
    })
  }

  async fetchText(fileURI: string): Promise<string> {
    console.log('fetch text', getHttpLinkFromIpfsString(fileURI))
    return await fetch(
      getHttpLinkFromIpfsString(fileURI), {
        method: 'GET',
        mode: 'cors'
      }).then(async resp => {
      if (resp.ok) {
        return await resp
          .text()
      } else {
        return await resp
          .text()
          .then(text => {
            console.log('fetch text error', resp)
            throw new Error(text)
          })
      }
    })
  }
}

export const ipfsService = new IPFSService()
