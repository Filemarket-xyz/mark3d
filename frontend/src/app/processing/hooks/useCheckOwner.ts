import { TokenFullId } from '../types'
import { useOwnerOfNFT } from './useOwnerOfNFT'
import { useAccount } from 'wagmi'
import { utils } from 'ethers'
import { ReactNode } from 'react'

export interface UseCheckOwnerArgs<Owner, NotOwner, ErrorResult = ReactNode> {
  /**
   * Token full id to check, if it's owned
   */
  tokenFullId: Partial<TokenFullId>
  /**
   * Value to be returned, if current user is owner
   */
  owner: Owner
  /**
   * Value to be returned, if current user is not owner
   */
  notOwner: NotOwner

  error?: (error: Error) => ErrorResult
}

export function useCheckOwner<Owner, NotOwner, ErrorResult>(
  { tokenFullId, owner, notOwner, error: errorRender }: UseCheckOwnerArgs<Owner, NotOwner, ErrorResult>
): Owner | NotOwner | ErrorResult {
  const { data: ownerAddress, error } = useOwnerOfNFT(tokenFullId)
  const { address } = useAccount()
  const isOwner = ownerAddress && address && utils.getAddress(ownerAddress) === utils.getAddress(address)
  if (error && errorRender) {
    return errorRender(error)
  }
  if (isOwner) {
    return owner
  } else {
    return notOwner
  }
}
