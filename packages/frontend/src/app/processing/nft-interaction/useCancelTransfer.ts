import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { TokenFullId } from '../types'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

export function useCancelTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const cancelTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('cancel transfer', { tokenId })

    return callContract({ contract, method: 'cancelTransfer' },
      BigNumber.from(tokenId),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
