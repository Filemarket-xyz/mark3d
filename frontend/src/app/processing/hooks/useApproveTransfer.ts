import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { Transfer, TransferStatus } from '../../../swagger/Api'
import { useTransaction } from 'wagmi'

export function useApproveTransfer(collectionAddress?: string, tokenId?: string, transfer?: Transfer) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const setPublicKeyTxId = transfer?.statuses?.find(status => status.status === TransferStatus.PublicKeySet)?.txId

  const setPublicKeyTx = useTransaction({
    hash: setPublicKeyTxId as `0x${string}` | undefined
  })

  const approveTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    if (collectionAddress && tokenId) {
      const owner = await factory.getOwner({ collectionAddress, tokenId })
    } else {
      throw Error('collectionAddress or tokenId is not provided')
    }
  }), [contract, wrapPromise])
}
