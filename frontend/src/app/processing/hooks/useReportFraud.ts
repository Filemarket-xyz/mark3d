import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt, ethers } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import assert from 'assert'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { TokenFullId } from '../types'

export function useReportFraud({ collectionAddress, tokenId }: Partial<TokenFullId>) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    const buyer = await factory.getBuyer({ collectionAddress, tokenId })
    const privateKey = await buyer.revealFraudReportRSAPrivateKey()
    const res = await contract.finalizeTransfer(
      BigNumber.from(tokenId),
      ethers.utils.hexlify(Buffer.from(privateKey, 'utf-8')) as `0x${string}`
    )
    return await res.wait()
  }), [contract, signer, wrapPromise])

  return {
    ...statuses,
    reportFraud
  }
}
