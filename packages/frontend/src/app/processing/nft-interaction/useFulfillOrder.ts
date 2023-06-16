import assert from 'assert'
import { BigNumber, BigNumberish, ContractReceipt, utils } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { api } from '../../config/api'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { IRarityWl } from '../../stores/FileBunnies/FileBunniesTokenIdStore'
import { useExchangeContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import {
  assertAccount, assertCollection,
  assertContract,
  assertSigner,
  assertTokenId,
  bufferToEtherHex,
  callContract,
} from '../utils'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 * @param price an integer price
 */
export function useFulfillOrder(
  { collectionAddress, tokenId }: Partial<TokenFullId> = {},
  price?: BigNumberish,
  suffix?: IRarityWl,
) {
  const { contract, signer } = useExchangeContract()
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const fulfillOrder = useCallback(wrapPromise(async () => {
    let tokenIdBN: string | undefined
    let collectionAddressBN: string | undefined = collectionAddress

    if (suffix !== undefined) {
      // const collectionAddressReq = await api.collections.fullFileBinniesList()
      collectionAddressBN = '0xdba60722700dbb8c0ec5339b6505a89f3bd4a17e'
      assertCollection(collectionAddressBN)
      const { data } = await api.sequencer.acquireDetail(collectionAddressBN.toLowerCase(), { suffix })
      tokenIdBN = data.tokenId
    } else {
      tokenIdBN = tokenId
    }

    assertCollection(collectionAddressBN)
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertTokenId(tokenIdBN)
    assertAccount(address)
    assert(price, 'price is not provided')

    const buyer = await factory.getBuyer(address, collectionAddressBN, +tokenIdBN)
    const publicKey = await buyer.initBuy()
    console.log('fulfill order', { collectionAddress, publicKey, tokenIdBN, price })

    return callContract(
      { contract, signer, method: 'fulfillOrder', minBalance: BigNumber.from(price) },
      utils.getAddress(collectionAddressBN),
      bufferToEtherHex(publicKey),
      BigNumber.from(tokenIdBN),
      '0x00',
      {
        value: BigNumber.from(price),
        gasPrice: mark3dConfig.gasPrice,
      },
    )
  }), [contract, address, wrapPromise, signer, collectionAddress, tokenId, price, suffix])

  return { ...statuses, fulfillOrder }
}
