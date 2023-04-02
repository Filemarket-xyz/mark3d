import { ethers } from 'ethers'

export function ensureAddress(address: string | undefined): `0x${string}` {
  return (address || ethers.constants.AddressZero) as `0x${string}`
}
