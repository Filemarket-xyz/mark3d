import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { str2ab } from '../../../../../crypto/src/lib/utils'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useSeed } from '../SeedProvider/useSeed'
import { TokenFullId } from '../types'
import { globalSaltMock } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'

export function useReportFraud({ collectionAddress, tokenId }: Partial<TokenFullId> = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const seed = useSeed(address)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()

  const factory = useHiddenFileProcessorFactory()

  const reportFraud = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    assert(collectionAddress, 'collection address not provided')
    assert(tokenId, 'tokenId is not provided')
    assert(seed, 'seed not found')

    const tokenIdBN = BigNumber.from(tokenId)
    const transferCountBN = await contract.transferCounts(tokenIdBN)
    const buyer = await factory.getBuyer(address, { collectionAddress, tokenId })
    const privateKey = await buyer.revealFraudReportRSAPrivateKey(
      seed,
      globalSaltMock,
      str2ab(collectionAddress),
      +tokenId,
      transferCountBN.toNumber()
    )
    console.log('report fraud', 'tokenId', tokenId, 'privateKey', privateKey)

    const tx = await contract.reportFraud(
      tokenIdBN,
      privateKey,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, wrapPromise, seed])

  return {
    ...statuses,
    reportFraud
  }
}
