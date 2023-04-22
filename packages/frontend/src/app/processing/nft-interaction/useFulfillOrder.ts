import assert from 'assert'
import { BigNumber, BigNumberish, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { str2ab } from '../../../../../crypto/src/lib/utils'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract, useExchangeContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useSeed } from '../SeedProvider/useSeed'
import { TokenFullId } from '../types'
import { globalSaltMock } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

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
  const seed = useSeed(address)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const fulfillOrder = useCallback(wrapPromise(async () => {
    assertContract(exchangeContract, mark3dConfig.exchangeToken.name)
    assertContract(collectionContract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(address, 'need to connect wallet')
    assert(price, 'price is not provided')
    assert(seed, 'seed not found')

    const tokenFullId = { collectionAddress, tokenId }
    const tokenIdBN = BigNumber.from(tokenId)
    const buyer = await factory.getBuyer(address, tokenFullId)
    await factory.registerTokenFullId(address, buyer, tokenFullId)
    const transferCountBN = await collectionContract.transferCounts(tokenIdBN)
    const publicKey = await buyer.initBuy(
      seed,
      globalSaltMock,
      str2ab(collectionAddress),
      +tokenId,
      transferCountBN.toNumber() + 1
    )
    console.log('fulfill order', 'collectionAddress', collectionAddress, 'publicKey', publicKey, 'tokenId', tokenId, 'price', price)

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
  }), [exchangeContract, collectionContract, address, seed, wrapPromise, signer, collectionAddress, tokenId, price])
  return { ...statuses, fulfillOrder }
}
