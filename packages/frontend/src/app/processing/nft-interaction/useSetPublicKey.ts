import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useSeed } from '../SeedProvider/useSeed'
import { TokenFullId } from '../types'
import { dealNumberMock, globalSaltMock, hexToBuffer } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

/**
 * Sets public key in a transfer process
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
export function useSetPublicKey({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const seed = useSeed(address)
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()

  const setPublicKey = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(seed, 'seed not found')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')

    const tokenFullId = { collectionAddress, tokenId }
    const tokenIdBN = BigNumber.from(tokenId)
    // const transferCountBN = await contract.transferCounts(tokenIdBN)
    const transferCountBN = BigNumber.from(dealNumberMock)
    const buyer = await factory.getBuyer(address, tokenFullId)
    await factory.registerTokenFullId(address, buyer, tokenFullId)
    const publicKey = await buyer.initBuy(
      seed,
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId,
      transferCountBN.toNumber()
    )
    console.log('setTransferPublicKey', 'tokenId', tokenId, 'publicKey', publicKey)

    const tx = await contract.setTransferPublicKey(
      tokenIdBN,
      publicKey,
      transferCountBN,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, seed, collectionAddress, tokenId])

  return { ...statuses, setPublicKey }
}
