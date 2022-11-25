import { TokenFullId } from '../types'
import { BigNumber, ContractReceipt } from 'ethers'
import { useExchangeContract } from './useExchangeContract'
import { useStatusState } from '../../hooks'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import assert from 'assert'

/**
 * Calls Mark3dExchange contract to cancel an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */
export function useCancelOrder({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const cancelOrder = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    const result = await contract.cancelOrder(
      collectionAddress as `0x${string}`,
      BigNumber.from(tokenId)
    )
    return await result.wait()
  }), [contract, signer, wrapPromise, collectionAddress, tokenId])
  return {
    ...statuses,
    cancelOrder
  }
}
