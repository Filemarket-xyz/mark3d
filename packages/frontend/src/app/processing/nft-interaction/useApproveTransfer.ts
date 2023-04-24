import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useSeed } from '../SeedProvider/useSeed'
import { TokenFullId } from '../types'
import { globalSaltMock, hexToBuffer } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

export function useApproveTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, publicKey?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const seed = useSeed(address)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const approveTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    assert(seed, 'seed not found')
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(publicKey, 'publicKey was not set (or transfer object is null)')

    if (!publicKey.startsWith('0x')) {
      publicKey = `0x${publicKey}`
    }
    const owner = await factory.getOwner(address, { collectionAddress, tokenId })
    const encryptedAESPassword = await owner.prepareFileAESKeyForBuyer(
      hexToBuffer(publicKey),
      seed,
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId
    )
    console.log('approve transfer', 'tokenId', tokenId, 'encryptedAESPassword', encryptedAESPassword)

    const tx = await contract.approveTransfer(
      BigNumber.from(tokenId),
      encryptedAESPassword,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, seed, wrapPromise, publicKey])

  return {
    ...statuses,
    approveTransfer
  }
}
