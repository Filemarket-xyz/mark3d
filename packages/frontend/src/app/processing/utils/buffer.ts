export const hexToBuffer = (hex: string) => {
  let string = hex
  if (string.startsWith('0x')) {
    string = string.slice(2)
  }

  return Buffer.from(string, 'hex')
}
