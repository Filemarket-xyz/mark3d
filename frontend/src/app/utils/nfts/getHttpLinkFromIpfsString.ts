const getIpfsCid = (ipfs: string) => {
  const pattern = /ipfs:\/\/([A-Za-z0-9/.-_]+)/
  return pattern.exec(ipfs)?.[1] ?? ''
}

export const getHttpLinkFromIpfsString = (ipfs: string) => {
  const ipfsCid = getIpfsCid(ipfs)
  return `https://nftstorage.link/ipfs/${ipfsCid}`
}
