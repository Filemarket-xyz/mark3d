import assert from 'assert'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { buf2Hex } from '../../../../../crypto/src/lib/utils'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useLastTransferInfo } from '../../hooks/useLastTransferInfo'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { TokenFullId } from '../types'
import { assertAccount, assertCollection, assertContract, assertSigner, assertTokenId, globalSaltMock, hexToBuffer } from '../utils'

export function useApproveTransfer({ collectionAddress, tokenId }: Partial<TokenFullId> = {}, publicKey?: string) {
  const { contract, signer } = useCollectionContract(collectionAddress)
  const { address } = useAccount()
  const { statuses, wrapPromise } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const { encryptedPassword, dealNumber } = useLastTransferInfo(collectionAddress, tokenId)

  const approveTransfer = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertAccount(address)
    assertCollection(collectionAddress)
    assertTokenId(tokenId)
    assert(publicKey, 'publicKey was not set (or transfer object is null)')

    if (!publicKey.startsWith('0x')) {
      publicKey = `0x${publicKey}`
    }
    const owner = await factory.getOwner(address)
    const encryptedFilePassword = await owner.encryptFilePassword(
      hexToBuffer(publicKey),
      encryptedPassword,
      dealNumber,
      globalSaltMock,
      hexToBuffer(collectionAddress),
      +tokenId
    )
    console.log('approve transfer', { tokenId, encryptedFilePassword })

    const tx = await contract.approveTransfer(
      BigNumber.from(tokenId),
      `0x${buf2Hex(encryptedFilePassword)}`,
      { gasPrice: mark3dConfig.gasPrice }
    )

    return tx.wait()
  }), [contract, signer, address, wrapPromise, publicKey, encryptedPassword, dealNumber])

  return {
    ...statuses,
    approveTransfer
  }
}
