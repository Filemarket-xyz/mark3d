import { utils } from 'ethers'
import { useAccount } from 'wagmi'

import { TokenFullId } from '../types'
import { useOwnerOfNFT } from './useOwnerOfNFT'

export function useIsOwner(tokenFullId: Partial<TokenFullId> = {}) {
  const { data: ownerAddress, ...statuses } = useOwnerOfNFT(tokenFullId)
  const { address } = useAccount()
  const isOwner = ownerAddress && address && utils.getAddress(ownerAddress) === utils.getAddress(address)

  return {
    ...statuses,
    isOwner,
  }
}
