import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

interface IUseFinalizeTransfer {
  collectionAddress?: string
}

interface IFinalizeTransfer {
  tokenId?: string
}

export function useFinalizeTransfer({ collectionAddress }: IUseFinalizeTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IFinalizeTransfer>()

  const finalizeTransfer = useCallback(wrapPromise(async ({ tokenId }: IFinalizeTransfer) => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('finalize transfer', { tokenId })

    return callContract({ contract, method: 'finalizeTransfer' },
      BigNumber.from(tokenId),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    finalizeTransfer,
  }
}
