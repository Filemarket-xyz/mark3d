import assert from 'assert'
import { BigNumber, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { TokenFullId } from '../types'
import { catchContractCallError, nullAddress } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

export function useInitTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, to?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const initTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return catchContractCallError({ contract, method: 'initTransfer' },
      BigNumber.from(tokenId),
      utils.getAddress(to),
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
