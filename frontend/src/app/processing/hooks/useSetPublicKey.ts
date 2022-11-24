import { TokenFullId } from '../types'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { useCallback } from 'react'
import assert from 'assert'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { useCollectionContract } from './useCollectionContract'

/**
 * Sets public key in a transfer process
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
export function useSetPublicKey({ collectionAddress, tokenId }: Partial<TokenFullId>) {
  const { contract, signer } = useCollectionContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const setPublicKey = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    const buyer = await factory.getBuyer({ collectionAddress, tokenId })
    const publicKey = await buyer.initBuy()
    const result = await contract.setTransferPublicKey(
      BigNumber.from(tokenId),
      publicKey as `0x${string}`
    )
    return await result.wait()
  }), [contract, signer, collectionAddress, tokenId])
  return { ...statuses, setPublicKey }
}
