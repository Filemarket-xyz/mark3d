import { useAccessTokenContract } from '../contracts'
import { useCallback } from 'react'
import { randomBytes } from 'ethers/lib/utils'
import { useStatusState } from '../../hooks'
import { ContractReceipt } from 'ethers'
import { mark3dConfig } from '../../config/mark3d'
import { Mark3dAccessTokenEventNames } from '../types'
import { assertContract, assertSigner } from '../utils/assert'
import assert from 'assert'
import { useUploadLighthouse } from './useUploadLighthouse'
import { normalizeCounterId } from '../utils/id'

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
    const result = await contract.createCollection(
      salt,
      name,
      symbol,
      metadata.url,
      metadata.url,
      '0x00',
      { gasPrice: mark3dConfig.gasPrice }
    )
    const receipt = await result.wait()
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
    return {
      collectionId,
      collectionTokenAddress,
      receipt
    }
  }), [contract, signer, name, symbol, image, description, wrapPromise, upload])
  return { ...statuses, mintCollection }
}
