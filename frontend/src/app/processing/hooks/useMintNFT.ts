import { useStatusState } from '../../hooks'
import { useCallback } from 'react'
import { nftStorage } from '../../config/nftStorage'
import { mark3dConfig } from '../../config/mark3d'
import { ERC721TokenEvents, FileMeta } from '../types'
import { ContractReceipt } from 'ethers'
import { useHiddenFileProcessorFactory } from './useHiddenFileProcessorFactory'
import { useCollectionContract } from './useCollectionContract'
import { normalizeCounterId } from '../utils/id'

export interface MintNFTForm {
  name?: string // required, hook will return error if omitted
  description?: string
  collectionAddress?: string // required
  image?: File // required
  hiddenFile?: File // required
}

interface MintNFTResult {
  tokenId: string
  receipt: ContractReceipt // вся инфа о транзе
}

export function useMintNFT(form: MintNFTForm) {
  const { contract, signer } = useCollectionContract(form.collectionAddress)
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult>()
  const factory = useHiddenFileProcessorFactory()
  const mintNFT = useCallback(async () => {
    return await wrapPromise(async () => {
      if (contract) {
        if (signer) {
          if (form.name && form.collectionAddress && form.image && form.hiddenFile) {
            const owner = await factory.getOwner()
            const hiddenFileEncrypted = new Blob([await owner.encryptFile(form.hiddenFile)])
            const hiddenFileMeta: FileMeta = {
              name: form.hiddenFile.name,
              type: form.hiddenFile.type
            }
            const metadata = await nftStorage.store({
              name: form.name,
              description: form.description ?? '',
              image: form.image,
              external_link: mark3dConfig.externalLink,
              hidden_file: hiddenFileEncrypted,
              hidden_file_meta: hiddenFileMeta
            })
            console.log('metadata', metadata)
            const address = await signer.getAddress()
            const result = await contract.mintWithoutId(address as `0x${string}`, metadata.url, '0x00')
            const receipt = await result.wait()
            const transferEvent = receipt.events?.find(event => event.event === ERC721TokenEvents.Transfer)
            if (!transferEvent) {
              throw Error(`receipt does not contain ${ERC721TokenEvents.Transfer} event`)
            }
            const tokenIdArgIndex = 2
            console.log('receipt', receipt)
            const tokenId = transferEvent.args?.[tokenIdArgIndex]
            if (!tokenId) {
              throw Error(`${ERC721TokenEvents.Transfer} does not have an arg with index ${tokenIdArgIndex}`)
            }
            return {
              tokenId: normalizeCounterId(tokenId),
              receipt
            }
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
  return { ...statuses, mintNFT }
}
