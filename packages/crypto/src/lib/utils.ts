/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/

export function stringToBuffer(string: string): ArrayBuffer {
  const buffer = new ArrayBuffer(string.length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0, strLen = string.length; i < strLen; i++) {
    bufferView[i] = string.charCodeAt(i);
  }
  return buffer;
}

export function removeSpaces(string: string): string {
  return string.replace(/\s/g, '')
}

export function numberToBuffer(number: number): Buffer {
  const numberHex = number.toString(16)
  return Buffer.from(numberHex.length % 2 ? '0' + numberHex : numberHex, 'hex')
}

export function bufferToHex(buffer: ArrayBuffer | Buffer): string {
  return Buffer.from(buffer).toString('hex')
}
