const getIpfsCidWithFilePath = (ipfs: string) => {
  const pattern = /ipfs:\/\/([A-Za-z0-9/.-_]+)/
  return pattern.exec(ipfs)?.[1] ?? ''
}

export const getHttpLinkFromIpfsString = (ipfs: string) => {
  const cidWithFilePath = getIpfsCidWithFilePath(ipfs)
  const [cid, filePath] = cidWithFilePath.split(/\/(.*)/s)

  return `https://${cid}.ipfs.nftstorage.link/${filePath}`
}
