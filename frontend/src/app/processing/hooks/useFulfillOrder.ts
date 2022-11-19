/**
 * Fulfills the existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
import { useExchangeContract } from './useExchangeContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt, ethers } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'

export function useFulfillOrder(collectionAddress?: string, tokenId?: string) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const fulfillOrder = useCallback(wrapPromise(async () => {
    assertContract(contract, 'Mark3dExchange')
    assertSigner(signer)
    if (collectionAddress && tokenId) {
      const buyer = await factory.getBuyer({ collectionAddress, tokenId })
      const publicKey = await buyer.initBuy()
      const result = await contract.fulfillOrder(
        collectionAddress as `0x${string}`,
        ethers.utils.hexlify(Buffer.from(publicKey, 'utf-8')) as `0x${string}`,
        BigNumber.from(tokenId)
      )
      return await result.wait()
    } else {
      throw Error('collectionAddress or tokenId is undefined')
    }
  }), [contract, signer, collectionAddress, tokenId])
  return { ...statuses, fulfillOrder }
}
