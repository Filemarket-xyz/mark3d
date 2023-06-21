import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { assertCollection, assertContract, assertSigner, assertTokenId, callContract } from '../utils'

/**
 * Used to approve Mark3dExchange contract to manage user's NFT. Should be called prior to placeOrder.
 * @param collectionAddress
 * @param tokenId
 */

interface IUseApproveExchange {
  collectionAddress?: string
  tokenId?: string
  callBack?: () => void
}

export function useApproveExchange({ collectionAddress, callBack }: IUseApproveExchange = {}) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { statuses, wrapPromise } = useStatusState<ContractReceipt, IUseApproveExchange>()
  const approveExchange = useCallback(wrapPromise(async ({ tokenId }) => {
    assertContract(contract, 'Mark3dCollection')
    assertSigner(signer)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)

    console.log('approve exchange', 'exchange contract address', mark3dConfig.exchangeToken.address, 'tokenId', tokenId)

    return callContract({ contract, method: 'approve' },
      mark3dConfig.exchangeToken.address,
      BigNumber.from(tokenId),
      { gasPrice: mark3dConfig.gasPrice },
    )
  }, callBack), [wrapPromise, contract, signer])

  return {
    ...statuses,
    approveExchange,
  }
}
