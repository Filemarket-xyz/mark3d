/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/

export function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function removeSpaces(str: string): string {
  return str.replace(/\s/g, '')
}

export function num2Buf(num: number): Buffer {
  const numHex = num.toString(16)
  return Buffer.from(numHex.length % 2 ? '0' + numHex : numHex, 'hex')
}

export function buf2Hex(buffer: ArrayBuffer | Buffer): string {
  return Buffer.from(buffer).toString('hex')
}
