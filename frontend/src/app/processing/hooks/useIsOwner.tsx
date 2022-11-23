import { useOwnerOfNFT } from './useOwnerOfNFT'
import { useAccount } from 'wagmi'
import { utils } from 'ethers'
import { TokenFullId } from '../types'

export function useIsOwner(tokenFullId: Partial<TokenFullId>) {
  const { data: ownerAddress, ...statuses } = useOwnerOfNFT(tokenFullId)
  const { address } = useAccount()
  const isOwner = ownerAddress && address && utils.getAddress(ownerAddress) === utils.getAddress(address)
  return {
    ...statuses,
    isOwner
  }
}
