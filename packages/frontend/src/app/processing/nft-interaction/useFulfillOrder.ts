import assert from 'assert'
import { BigNumber, BigNumberish, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract, useExchangeContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, dealNumberMock, globalSaltMock, hexToBuffer } from '../utils'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price an integer price
 */
export function useFulfillOrder(
  { collectionAddress, tokenId }: Partial<TokenFullId> = {},
  price?: BigNumberish
) {
  const { contract: exchangeContract, signer } = useExchangeContract()
  const { contract: collectionContract } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const fulfillOrder = useCallback(wrapPromise(async () => {
    assertContract(exchangeContract, mark3dConfig.exchangeToken.name)
    assertContract(collectionContract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assertAccount(address)
    assert(price, 'price is not provided')

    const tokenIdBN = BigNumber.from(tokenId)
    const buyer = await factory.getBuyer(address)

    // const transferCountBN = await collectionContract.transferCounts(tokenIdBN)
    const transferCountBN = BigNumber.from(dealNumberMock)
    const publicKey = await buyer.initBuy(
      transferCountBN.toNumber(),
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId
    )
    console.log('fulfill order', { collectionAddress, publicKey, tokenId, price })

    const tx = await exchangeContract.fulfillOrder(
      utils.getAddress(collectionAddress),
      publicKey,
      tokenIdBN,
      {
        value: BigNumber.from(price),
        gasPrice: mark3dConfig.gasPrice
      }
    )

    return tx.wait()
  }), [exchangeContract, collectionContract, address, wrapPromise, signer, collectionAddress, tokenId, price])
  return { ...statuses, fulfillOrder }
}
