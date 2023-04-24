import { useStatusState } from '../../hooks'
import { useCallback } from 'react'
import { mark3dConfig } from '../../config/mark3d'
import { ERC721TokenEventNames, FileMeta } from '../types'
import { ContractReceipt } from 'ethers'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useCollectionContract } from '../contracts'
import { normalizeCounterId } from '../utils/id'
import { assertContract, assertSigner } from '../utils/assert'
import { useAccount } from 'wagmi'
import assert from 'assert'
import { useUploadLighthouse } from './useUploadLighthouse'

export interface MintNFTForm {
  name?: string // required, hook will return error if omitted
  description?: string
  collectionAddress?: string // required
  image?: File // required
  hiddenFile?: File // required
  license?: string // required
  licenseUrl?: string // required
  categories?: string[] // required
  tags?: string[] // required
  subcategories?: string[]
}

interface MintNFTResult {
  tokenId: string
  receipt: ContractReceipt // вся инфа о транзе
}

export function useMintNFT(form: MintNFTForm = {}) {
  const { contract, signer } = useCollectionContract(form.collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult>()
  const factory = useHiddenFileProcessorFactory()
  const upload = useUploadLighthouse()
  const mintNFT = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    const { name, description, image, hiddenFile, collectionAddress, license, tags, subcategories, categories } = form
    if (name && collectionAddress && image && hiddenFile) {
      const owner = await factory.getOwner(address, undefined)
      const hiddenFileEncrypted = new Blob([await owner.encryptFile(hiddenFile)])
      const hiddenFileMeta: FileMeta = {
        name: hiddenFile.name,
        type: hiddenFile.type,
        size: hiddenFile.size
      }
      const metadata = await upload({
        name,
        description: description ?? '',
        image,
        external_link: mark3dConfig.externalLink,
        hidden_file: hiddenFileEncrypted,
        hidden_file_meta: hiddenFileMeta,
        categories,
        license,
        tags,
        subcategories
      })
      console.log('mint metadata', metadata)
      const result = await contract.mintWithoutId(
        address as `0x${string}`,
        metadata.url,
        '0x00',
        { gasPrice: mark3dConfig.gasPrice }
      )
      const receipt = await result.wait()
      const transferEvent = receipt.events?.find(event => event.event === ERC721TokenEventNames.Transfer)
      if (!transferEvent) {
        throw Error(`receipt does not contain ${ERC721TokenEventNames.Transfer} event`)
      }
      const tokenIdArgIndex = 2
      console.log('receipt', receipt)
      const rawTokenId = transferEvent.args?.[tokenIdArgIndex]
      if (!rawTokenId) {
        throw Error(`${ERC721TokenEventNames.Transfer} does not have an arg with index ${tokenIdArgIndex}`)
      }
      const tokenId = normalizeCounterId(rawTokenId)
      await factory.registerTokenFullId(address, owner, { collectionAddress, tokenId })
      return {
        tokenId,
        receipt
      }
    } else {
      throw Error('CreateCollection form is not filled')
    }
  }), [contract, signer, address, factory, form, wrapPromise])
  return { ...statuses, mintNFT }
}
