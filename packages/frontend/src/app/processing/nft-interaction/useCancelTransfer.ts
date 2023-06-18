import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

interface IUseCancelTransfer {
  collectionAddress?: string
  tokenId?: string
  callBack?: () => void
}

export function useCancelTransfer({ collectionAddress, callBack }: IUseCancelTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IUseCancelTransfer>()

  const cancelTransfer = useCallback(wrapPromise(async ({ collectionAddress, tokenId }) => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('cancel transfer', { tokenId })

    return callContract({ contract, method: 'cancelTransfer' },
      BigNumber.from(tokenId),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }, callBack), [contract, signer, wrapPromise])

  return {
    ...statuses,
    cancelTransfer,
  }
}
