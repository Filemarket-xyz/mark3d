import { BigNumber } from 'ethers'
import { TokenFullId } from '../types'

/**
 * Receives hex string or any kind of numberish value and returns it in as a decimal, with no leading zeros integer
 */
export const normalizeCounterId = (id: string | BigNumber) => BigNumber.from(id).toString()

// Looks like JSON, but not JSON, cos it is not deterministic
export const stringifyTokenFullId = (tokenFullId: TokenFullId) =>
  `{"collectionAddress":${tokenFullId.collectionAddress},"tokenId":${tokenFullId.tokenId}}`

export const parseTokenFullId = (tokenFullId: string): TokenFullId => JSON.parse(tokenFullId)

export const makeTokenFullId = (collectionAddress?: string, tokenId?: string): TokenFullId | undefined =>
  collectionAddress && tokenId ? { collectionAddress, tokenId } : undefined

const addressLen = 40

export const nullAddress = `0x${Array(addressLen).fill('0').join('')}` as const
