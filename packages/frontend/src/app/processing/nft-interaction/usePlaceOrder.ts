import assert from 'assert'
import { BigNumber, BigNumberish, constants, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useExchangeContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId } from '../utils'
import { callContract } from '../utils/error'

interface IPlaceOrder {
  collectionAddress?: string
  tokenId?: string
  price?: BigNumberish
  callBack?: () => void
}

/**
 * Calls Mark3dExchange contract to place an order
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price must be in wei (without floating point)
 */

export function usePlaceOrder({ callBack }: IPlaceOrder = {}) {
  const { contract, signer } = useExchangeContract()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt | undefined, IPlaceOrder>()

  const placeOrder = useCallback(wrapPromise(async ({ collectionAddress, tokenId, price }: IPlaceOrder) => {
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
      constants.AddressZero,
      { gasPrice: mark3dConfig.gasPrice },
    )
  }, callBack), [contract, signer, wrapPromise])

  return {
    ...statuses,
    placeOrder,
  }
}
