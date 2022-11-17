import { useAccessTokenContract } from './useAccessTokenContract'
import { useCallback } from 'react'
import { nftStorage } from '../../config/nftStorage'
import { randomBytes } from 'ethers/lib/utils'
import { useStatusState } from '../../hooks/useStatusState'
import { ContractReceipt } from 'ethers'
import { mark3dConfig } from '../../config/mark3d'

export interface CreateCollectionForm {
  name?: string // required, hook will return error if omitted
  symbol?: string // required
  description?: string
  image?: File // required
}

export function useCreateCollection(form: CreateCollectionForm) {
  const { contract, signer } = useAccessTokenContract()
  const { wrapPromise, ...statuses } = useStatusState<ContractReceipt>()
  const createCollection = useCallback(async () => {
    return await wrapPromise(async () => {
      console.log('mint!', form)
      if (contract) {
        if (signer) {
          if (form.name && form.symbol && form.image) {
            const metadata = await nftStorage.store({
              name: form.name,
              description: form.description ?? '',
              image: form.image,
              external_link: mark3dConfig.externalLink
            })
            console.log('metadata', metadata)
            const salt = `0x${Buffer.from(randomBytes(32)).toString('hex')}` as const
            const result = await contract.createCollection(salt, form.name, form.symbol, metadata.url, metadata.url, '0x')
            const receipt = await result.wait()
            console.log('receipt', receipt)
            return receipt
          } else {
            throw Error('CreateCollection form is not filled')
          }
        } else {
          throw new Error('User must have connected wallet to create collection')
        }
      } else {
        throw Error('AccessTokenContract is undefined. Please, try again')
      }
    })
  }, [contract, form, wrapPromise])
  return { ...statuses, createCollection }
}
