import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'
import { callContract } from '../utils/error'

interface IUseApproveTransfer {
  collectionAddress?: string
}

interface IApproveTransfer {
  tokenId?: string
  publicKey?: string
}

export function useApproveTransfer({ collectionAddress }: IUseApproveTransfer = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IApproveTransfer>()
  const factory = useHiddenFileProcessorFactory()

  const approveTransfer = useCallback(wrapPromise(async ({ tokenId, publicKey }) => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(publicKey, 'publicKey was not set (or transfer object is null)')

    if (!publicKey.startsWith('0x')) {
      publicKey = `0x${publicKey}`
    }
    const owner = await factory.getOwner(address, collectionAddress, +tokenId)
    const encryptedFilePassword = await owner.encryptFilePassword(hexToBuffer(publicKey))
    console.log('approve transfer', { tokenId, encryptedFilePassword })

    return callContract({ contract, method: 'approveTransfer' },
      BigNumber.from(tokenId),
      bufferToEtherHex(encryptedFilePassword),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }), [contract, signer, address, wrapPromise])

  return {
    ...statuses,
    approveTransfer,
  }
}
