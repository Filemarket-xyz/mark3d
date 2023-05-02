import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, hexToBuffer } from '../utils'

export function useApproveTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, publicKey?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const approveTransfer = useCallback(wrapPromise(async () => {
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

    const tx = await contract.approveTransfer(
      BigNumber.from(tokenId),
      bufferToEtherHex(encryptedFilePassword),
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, wrapPromise, publicKey])

  return {
    ...statuses,
    approveTransfer
  }
}
