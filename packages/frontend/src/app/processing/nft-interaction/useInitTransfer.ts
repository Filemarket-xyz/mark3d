import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { TokenFullId } from '../types'
import { callContract, nullAddress } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

export function useInitTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, to?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const initTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'initTransfer' },
      BigNumber.from(tokenId),
      to,
      '0x00',
      nullAddress,
      { gasPrice: mark3dConfig.gasPrice }
    )
  }), [contract, signer, wrapPromise, collectionAddress, tokenId, to])

  return {
    ...statuses,
    initTransfer
  }
}
