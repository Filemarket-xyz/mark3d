import { useExchangeContract } from './useExchangeContract'
import { useStatusState } from '../../hooks'
import { BigNumber, BigNumberish, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import { TokenFullId } from '../types'

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */
export function usePlaceOrder({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, price?: BigNumberish) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const placeOrder = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    if (collectionAddress && tokenId && price) {
      console.log('place order', 'collectionAddress', collectionAddress, 'tokenId', tokenId, 'price', price)
      const result = await contract.placeOrder(
        collectionAddress as `0x${string}`,
        BigNumber.from(tokenId),
        BigNumber.from(price)
      )
      return await result.wait()
    } else {
      throw Error('collectionAddress or tokenId or price is undefined')
    }
  }), [contract, signer, wrapPromise, collectionAddress, tokenId, price])
  return {
    ...statuses,
    placeOrder
  }
}