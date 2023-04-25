import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, dealNumberMock, globalSaltMock, hexToBuffer } from '../utils'

export function useReportFraud({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    const tokenIdBN = BigNumber.from(tokenId)
    // const transferCountBN = await contract.transferCounts(tokenIdBN)
    const transferCountBN = BigNumber.from(dealNumberMock)
    const buyer = await factory.getBuyer(address)
    const privateKey = await buyer.revealRsaPrivateKey(
      transferCountBN.toNumber(),
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId
    )
    console.log('report fraud', { tokenId, privateKey })

    const tx = await contract.reportFraud(
      tokenIdBN,
      privateKey,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, wrapPromise])

  return {
    ...statuses,
    reportFraud
  }
}
