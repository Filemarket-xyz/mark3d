import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, dealNumberMock, globalSaltMock, hexToBuffer } from '../utils'

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
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(mark3dConfig.gasPrice, 'gas price is undefined') // !!!!!

    const tokenIdBN = BigNumber.from(tokenId)
    // const transferCountBN = await contract.transferCounts(tokenIdBN)
    const transferCountBN = BigNumber.from(dealNumberMock)
    const buyer = await factory.getBuyer(address)
    const publicKey = await buyer.initBuy(
      transferCountBN.toNumber(),
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId
    )
    console.log('setTransferPublicKey', { tokenId, publicKey })

    const tx = await contract.setTransferPublicKey(
      tokenIdBN,
      `0x${buf2Hex(publicKey)}`,
      transferCountBN,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, collectionAddress, tokenId])

  return { ...statuses, setPublicKey }
}
