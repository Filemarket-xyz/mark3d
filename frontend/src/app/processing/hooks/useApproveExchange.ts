import { TokenFullId } from '../types'
import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { mark3dConfig } from '../../config/mark3d'
import { assertContract, assertSigner } from '../utils/assert'
import assert from 'assert'

/**
 * Used to approve Mark3dExchange contract to manage user's NFT. Should be called prior to placeOrder.
 * @param collectionAddress
 * @param tokenId
 */
export function useApproveExchange({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const approveExchange = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, 'Mark3dCollection')
    assertSigner(signer)
    console.log('approve exchange', 'exchange contract address', mark3dConfig.exchangeToken.address, 'tokenId', tokenId)
    const result = await contract.approve(mark3dConfig.exchangeToken.address, BigNumber.from(tokenId))
    return await result.wait()
  }), [wrapPromise, contract, signer, tokenId])
  return {
    ...statuses,
    approveExchange
  }
}
