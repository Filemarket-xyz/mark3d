import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useBlockchainDataProvider } from '../BlockchainDataProvider'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, callContract, hexToBuffer } from '../utils'

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
  const blockchainDataProvider = useBlockchainDataProvider()

  const setPublicKey = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(mark3dConfig.gasPrice, 'gas price is undefined') // !!!!!

    const dealNumber = await blockchainDataProvider.getTransferCount(hexToBuffer(collectionAddress), +tokenId)
    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const publicKey = await buyer.initBuy()
    console.log('setTransferPublicKey', { tokenId, publicKey })

    return callContract({ contract, method: 'setTransferPublicKey' },
      BigNumber.from(tokenId),
      bufferToEtherHex(publicKey),
      BigNumber.from(dealNumber),
      { gasPrice: mark3dConfig.gasPrice }
    )
  }), [contract, signer, address, collectionAddress, tokenId])

  return { ...statuses, setPublicKey }
}
