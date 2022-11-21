import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { Transfer } from '../../../swagger/Api'
import * as assert from 'assert'

export function useApproveTransfer(collectionAddress?: string, tokenId?: string, transfer?: Transfer) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const publicKeyStr = transfer?.publicKey

  const approveTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(publicKeyStr, 'publicKey was not set (or transfer object is null)')
    const owner = await factory.getOwner({ collectionAddress, tokenId })
    const encryptedAESPassword = await owner.prepareFileAESKeyForBuyer(publicKeyStr)
    const res = await contract.approveTransfer(
      BigNumber.from(tokenId),
      utils.hexlify(encryptedAESPassword) as `0x${string}`
    )
    return await res.wait()
  }), [contract, signer, wrapPromise, publicKeyStr])

  return {
    ...statuses,
    approveTransfer
  }
}
