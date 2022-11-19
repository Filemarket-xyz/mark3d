import { useAccessTokenContract } from './useAccessTokenContract'
import { useCallback } from 'react'
import { nftStorage } from '../../config/nftStorage'
import { randomBytes } from 'ethers/lib/utils'
import { useStatusState } from '../../hooks'
import { BigNumber, ContractReceipt } from 'ethers'
import { mark3dConfig } from '../../config/mark3d'
import { Mark3dAccessTokenEvents } from '../types'
import { assertContract, assertSigner } from '../utils/assert'

export interface CreateCollectionForm {
  name?: string // required, hook will return error if omitted
  symbol?: string // required
  description?: string
  image?: File // required
}

interface CreateCollectionResult {
  collectionId: string
  collectionTokenAddress: string
  receipt: ContractReceipt // вся инфа о транзе
}

export function useCreateCollection(form: CreateCollectionForm) {
  const { contract, signer } = useAccessTokenContract()
  const { wrapPromise, ...statuses } = useStatusState<CreateCollectionResult>()
  const createCollection = useCallback(wrapPromise(async () => {
    console.log('mint!', form)
    assertContract(contract, 'Mark3dAccessToken')
    assertSigner(signer)
    if (form.name && form.symbol && form.image) {
      const metadata = await nftStorage.store({
        name: form.name,
        description: form.description ?? '',
        image: form.image,
        external_link: mark3dConfig.externalLink
      })
      console.log('metadata', metadata)
      const salt = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as const
      const result = await contract.createCollection(salt, form.name, form.symbol, metadata.url, metadata.url, '0x00')
      const receipt = await result.wait()
      const createCollectionEvent = receipt.events
        ?.find(event => event.event === Mark3dAccessTokenEvents.CollectionCreation)
      if (!createCollectionEvent) {
        throw Error(`receipt does not contain ${Mark3dAccessTokenEvents.CollectionCreation} event`)
      }
      return {
        collectionId: BigNumber.from(createCollectionEvent.topics[1]).toString(),
        collectionTokenAddress: createCollectionEvent.topics[2],
        receipt
      }
    } else {
      throw Error('CreateCollection form is not filled')
    }
  }), [contract, signer, form, wrapPromise])
  return { ...statuses, createCollection }
}
