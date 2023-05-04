import { getHttpLinkFromIpfsString } from '../utils/nfts/getHttpLinkFromIpfsString'

export class IPFSService {
  async fetchBytes(fileURI: string): Promise<Uint8Array> {
    return fetch(
      getHttpLinkFromIpfsString(fileURI), {
        method: 'GET',
        mode: 'cors'
      }).then(async resp => {
      if (resp.ok) {
        return resp
          .arrayBuffer()
          .then(buffer => new Uint8Array(buffer))
      } else {
        return resp
          .text()
          .then(text => {
            throw new Error(text)
          })
      }
    })
  }

  async fetchText(fileURI: string): Promise<string> {
    return fetch(
      getHttpLinkFromIpfsString(fileURI), {
        method: 'GET',
        mode: 'cors'
      }).then(async resp => {
      if (resp.ok) {
        return resp
          .text()
      } else {
        return resp
          .text()
          .then(text => {
            throw new Error(text)
          })
      }
    })
  }
}

export const ipfsService = new IPFSService()
