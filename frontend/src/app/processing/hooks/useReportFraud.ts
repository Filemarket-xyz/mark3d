import { useCollectionContract } from './useCollectionContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { mark3dConfig } from '../../config/mark3d'
import assert from 'assert'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { useAccount } from 'wagmi'

export function useReportFraud({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    const buyer = await factory.getBuyer(address, { collectionAddress, tokenId })
    const privateKey = await buyer.revealFraudReportRSAPrivateKey()
    console.log('report fraud', 'tokenId', tokenId, 'privateKey', privateKey)
    const res = await contract.reportFraud(
      BigNumber.from(tokenId),
      privateKey as `0x${string}`,
      { gasPrice: mark3dConfig.gasPrice }
    )
    return await res.wait()
  }), [contract, signer, address, wrapPromise])

  return {
    ...statuses,
    reportFraud
  }
}
