import { bufferToHex } from '../../../../../crypto/src/lib/utils'

export const hexToBuffer = (hex: string) => {
  let string = hex
  if (string.startsWith('0x')) {
    string = string.slice(2)
  }

  return Buffer.from(string, 'hex')
}

export const bufferToEtherHex = (buffer: ArrayBuffer): `0x${string}` => {
  return `0x${bufferToHex(buffer)}`
}
