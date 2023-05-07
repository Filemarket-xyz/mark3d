import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { TokenFullId } from '../types'
import { assertCollection, assertContract, assertSigner, assertTokenId, catchContractCallError, nullAddress } from '../utils'

export function useDraftTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const draftTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    console.log('draft transfer', { tokenId, callbackReceiver: nullAddress })

    return catchContractCallError(() => contract.draftTransfer(
      BigNumber.from(tokenId),
      nullAddress,
      { gasPrice: mark3dConfig.gasPrice }
    ))
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    draftTransfer
  }
}
