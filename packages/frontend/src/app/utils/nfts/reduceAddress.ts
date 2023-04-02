/** Reduce address to view like **0x1234...5678** */
export const reduceAddress = (profileAddress: string) => {
  return `${profileAddress.slice(0, 6)}...${profileAddress.slice(-4)}`
}
