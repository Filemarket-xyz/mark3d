import assert from 'assert'
import { ContractReceipt } from 'ethers'
import { randomBytes } from 'ethers/lib/utils'
import { useCallback } from 'react'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useAccessTokenContract } from '../contracts'
import { Mark3dAccessTokenEventNames } from '../types'
import { catchContractCallError } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'
import { normalizeCounterId } from '../utils/id'
import { useUploadLighthouse } from './useUploadLighthouse'

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
  collectionName: string
}

export function useMintCollection(form: CreateCollectionForm = {}) {
  const { contract, signer } = useAccessTokenContract()
  const { wrapPromise, ...statuses } = useStatusState<CreateCollectionResult>()
  const upload = useUploadLighthouse()
  const { name, symbol, image, description } = form
  const mintCollection = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.accessToken.name)
    assertSigner(signer)
    assert(name && symbol && image, 'CreateCollection form is not filled')

    const metadata = await upload({
      name,
      description: description ?? '',
      image,
      external_link: mark3dConfig.externalLink
    })
    console.log('mint metadata', metadata)

    const salt = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as const
    const receipt: ContractReceipt = await catchContractCallError(() => contract.createCollection(
      salt,
      name,
      symbol,
      metadata.url,
      metadata.url,
      '0x00',
      { gasPrice: mark3dConfig.gasPrice }
    ), { ignoreTxFailture: true })

    const createCollectionEvent = receipt.events
      ?.find(event => event.event === Mark3dAccessTokenEventNames.CollectionCreation)
    if (!createCollectionEvent) {
      throw Error(`receipt does not contain ${Mark3dAccessTokenEventNames.CollectionCreation} event`)
    }

    const collectionIdArgIndex = 0
    const collectionAddressArgIndex = 1
    const getArg = (index: number): any => {
      const arg = createCollectionEvent.args?.[index]
      assert(arg, `${Mark3dAccessTokenEventNames.CollectionCreation} does not have an arg with index ${index}`)
      return arg
    }

    const collectionId = normalizeCounterId(getArg(collectionIdArgIndex))
    const collectionTokenAddress: string = getArg(collectionAddressArgIndex)
    const collectionName = 'Test'

    return {
      collectionId,
      collectionTokenAddress,
      collectionName,
      receipt
    }
  }), [contract, signer, name, symbol, image, description, wrapPromise, upload])
  return { ...statuses, mintCollection }
}
