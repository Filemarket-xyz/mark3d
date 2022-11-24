import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import assert from 'assert'
import { TokenFullId } from '../types'
import { useAccount } from 'wagmi'

export function useApproveTransfer({ collectionAddress, tokenId }: Partial<TokenFullId>, publicKey?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const approveTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(publicKey, 'publicKey was not set (or transfer object is null)')
    if (!publicKey.startsWith('0x')) {
      publicKey = `0x${publicKey}`
    }
    console.log('tokenFullId', { collectionAddress, tokenId })
    const owner = await factory.getOwner(address, { collectionAddress, tokenId })
    const encryptedAESPassword = await owner.prepareFileAESKeyForBuyer(publicKey)
    const res = await contract.approveTransfer(
      BigNumber.from(tokenId),
      utils.hexlify(encryptedAESPassword) as `0x${string}`
    )
    return await res.wait()
  }), [contract, signer, address, wrapPromise, publicKey])

  return {
    ...statuses,
    approveTransfer
  }
}
