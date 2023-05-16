import assert from 'assert'
import { BigNumber, BigNumberish, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useExchangeContract } from '../contracts'
import { TokenFullId } from '../types'
import { assertCollection, assertContract, assertSigner, assertTokenId } from '../utils'
import { callContract } from '../utils/error'

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */
export function usePlaceOrder({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, price?: BigNumberish) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt | undefined>()
  const placeOrder = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(price, 'price is not provided')
    console.log('place order', { collectionAddress, tokenId, price })

    return callContract({ contract, method: 'placeOrder' },
      collectionAddress,
      BigNumber.from(tokenId),
      BigNumber.from(price),
      { gasPrice: mark3dConfig.gasPrice }
    )
  }), [contract, signer, wrapPromise, collectionAddress, tokenId, price])

  return {
    ...statuses,
    placeOrder
  }
}
