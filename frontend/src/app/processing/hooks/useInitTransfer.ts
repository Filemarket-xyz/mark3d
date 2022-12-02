import { TokenFullId } from '../types'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { useCollectionContract } from './useCollectionContract'
import assert from 'assert'
import { nullAddress } from '../utils/id'

export function useInitTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, to?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const initTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(to, 'receiver address ("to") is undefined')
    console.log('init transfer', 'tokenId', tokenId, 'to', to, 'callbackReceiver', nullAddress)
    const result = await contract.initTransfer(
      BigNumber.from(tokenId),
      to as `0x${string}`,
      '0x00',
      nullAddress
    )
    return await result.wait()
  }), [contract, signer, wrapPromise, collectionAddress, tokenId, to])
  return {
    ...statuses,
    initTransfer
  }
}
