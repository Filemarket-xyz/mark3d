import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { callContract, nullAddress } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

interface IInitTransfer {
  collectionAddress?: string
  tokenId?: string
  to?: string
  callBack?: () => void
}

export function useInitTransfer({ collectionAddress, callBack }: IInitTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, IInitTransfer>()

  const initTransfer = useCallback(wrapPromise(async ({ tokenId, to }: IInitTransfer) => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', { tokenId, to, callbackReceiver: nullAddress })

    return callContract({ contract, method: 'initTransfer' },
      BigNumber.from(tokenId),
      to,
      '0x00',
      nullAddress,
      { gasPrice: mark3dConfig.gasPrice },
    )
  }, callBack), [contract, signer, wrapPromise])

  return {
    ...statuses,
    initTransfer,
  }
}
