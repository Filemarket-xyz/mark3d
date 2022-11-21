import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import assert from 'assert'

export function useCancelTransfer(collectionAddress: string, tokenId: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const cancelTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    const res = await contract.cancelTransfer(BigNumber.from(tokenId))
    return await res.wait()
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    cancelTransfer
  }
}
