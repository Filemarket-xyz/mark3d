import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useBlockchainDataProvider } from '../BlockchainDataProvider'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, bufferToEtherHex, callContract, hexToBuffer } from '../utils'

interface IUseSetPublicKey {
  collectionAddress?: string
}

interface ISetPublicKey {
  tokenId?: string
}

export function useSetPublicKey({ collectionAddress }: IUseSetPublicKey = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt, ISetPublicKey>()
  const factory = useHiddenFileProcessorFactory()
  const blockchainDataProvider = useBlockchainDataProvider()

  const setPublicKey = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(mark3dConfig.gasPrice, 'gas price is undefined')

    const dealNumber = await blockchainDataProvider.getTransferCount(hexToBuffer(collectionAddress), +tokenId)
    const buyer = await factory.getBuyer(address, collectionAddress, +tokenId)
    const publicKey = await buyer.initBuy()
    console.log('setTransferPublicKey', { tokenId, publicKey })

    return callContract({ contract, method: 'setTransferPublicKey' },
      BigNumber.from(tokenId),
      bufferToEtherHex(publicKey),
      BigNumber.from(dealNumber),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }), [contract, signer, address, wrapPromise])

  return { ...statuses, setPublicKey }
}
