import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract, nullAddress } from '../utils'

interface IDraftTransfer {
  collectionAddress?: string
  tokenId?: string
}

export function useDraftTransfer() {
  const { contract, signer } = useCollectionContract()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IDraftTransfer>()

  const draftTransfer = useCallback(wrapPromise(async ({ collectionAddress, tokenId }: IDraftTransfer) => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('draft transfer', { tokenId, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'draftTransfer' },
      BigNumber.from(tokenId),
      nullAddress,
      { gasPrice: mark3dConfig.gasPrice },
    )
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    draftTransfer,
  }
}
