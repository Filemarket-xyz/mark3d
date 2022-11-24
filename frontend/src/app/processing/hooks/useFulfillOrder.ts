import { useExchangeContract } from './useExchangeContract'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { assertContract, assertSigner } from '../utils/assert'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { mark3dConfig } from '../../config/mark3d'
import { TokenFullId } from '../types'
import assert from 'assert'
import { useAccount } from 'wagmi'

/**
 * Fulfills an existing order.
 * @param collectionAddress
 * @param tokenId assigned to a token by the mint function
 */
export function useFulfillOrder({ collectionAddress, tokenId }: Partial<TokenFullId>) {
  const { contract, signer } = useExchangeContract()
  const { address } = useAccount()
  const { wrapPromise, statuses } = useStatusState<ContractReceipt>()
  const factory = useHiddenFileProcessorFactory()
  const fulfillOrder = useCallback(wrapPromise(async () => {
    assert(collectionAddress, 'collectionAddress is not provided')
    assert(tokenId, 'tokenId is not provided')
    assertContract(contract, mark3dConfig.exchangeToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    const tokenFullId = { collectionAddress, tokenId }
    const buyer = await factory.getBuyer(address, tokenFullId)
    await factory.registerTokenFullId(address, buyer, tokenFullId)
    const publicKey = await buyer.initBuy()
    // const message = Buffer.from('I am gay', 'utf8')
    const privateKey = await buyer.revealFraudReportRSAPrivateKey()
    console.log('buyer', 'publicKey', publicKey, 'privateKey', privateKey)
    // const decrypted = await decryptRSA(await encryptRSA(message, publicKey), privateKey)
    // console.log('crypto test', decrypted.ok && Buffer.from(decrypted.result).toString('utf8'))
    console.log('collectionAddress', collectionAddress, 'publicKey', publicKey, 'tokenId', tokenId)
    const result = await contract.fulfillOrder(
      collectionAddress as `0x${string}`,
      publicKey as `0x${string}`,
      BigNumber.from(tokenId),
      {
        value: BigNumber.from('1337')
      }
    )
    return await result.wait()
  }), [contract, signer, collectionAddress, tokenId])
  return { ...statuses, fulfillOrder }
}
