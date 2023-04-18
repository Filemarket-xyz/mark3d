import { TokenFullId } from '../types'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useCallback } from 'react'
import assert from 'assert'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { useCollectionContract } from '../contracts'
import { useAccount } from 'wagmi'

/**
 * Sets public key in a transfer process
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
export function useSetPublicKey({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const setPublicKey = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    const tokenFullId = { collectionAddress, tokenId }
    const buyer = await factory.getBuyer(address, tokenFullId)
    await factory.registerTokenFullId(address, buyer, tokenFullId)
    const publicKey = await buyer.initBuy()
    console.log('setTransferPublicKey', 'tokenId', tokenId, 'publicKey', publicKey)
    const result = await contract.setTransferPublicKey(
      BigNumber.from(tokenId),
      publicKey as `0x${string}`,
      { gasPrice: mark3dConfig.gasPrice }
    )
    return await result.wait()
  }), [contract, signer, address, collectionAddress, tokenId])
  return { ...statuses, setPublicKey }
}
