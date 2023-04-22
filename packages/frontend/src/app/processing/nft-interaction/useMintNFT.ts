import assert from 'assert'
import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { str2ab } from '../../../../../crypto/src/lib/utils'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { useSeed } from '../SeedProvider/useSeed'
import { ERC721TokenEventNames, FileMeta } from '../types'
import { globalSaltMock } from '../utils'
import { assertContract, assertSigner } from '../utils/assert'
import { normalizeCounterId } from '../utils/id'
import { useUploadLighthouse } from './useUploadLighthouse'

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

export function useMintNFT(form: MintNFTForm = {}) {
  const { contract, signer } = useCollectionContract(form.collectionAddress)
  const { address } = useAccount()
  const seed = useSeed(address)
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult>()
  const factory = useHiddenFileProcessorFactory()
  const upload = useUploadLighthouse()

  const mintNFT = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assert(address, 'need to connect wallet')
    assert(seed, 'seed not found')

    const { name, description, image, hiddenFile, collectionAddress } = form
    if (name && collectionAddress && image && hiddenFile) {
      const owner = await factory.getOwner(address, undefined)
      const tokenCountBN = await contract.tokensCount()

      const encryptedArrayBuffer = await owner.encryptFile(
        hiddenFile,
        seed,
        globalSaltMock,
        str2ab(collectionAddress),
        tokenCountBN.toNumber() + 1
      )
      const hiddenFileEncrypted = new Blob([encryptedArrayBuffer])
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
        hidden_file_meta: hiddenFileMeta
      })
      console.log('mint metadata', metadata)

      const tx = await contract.mintWithoutId(
        address as `0x${string}`,
        metadata.url,
        '0x00',
        { gasPrice: mark3dConfig.gasPrice }
      )
      const receipt = await tx.wait()
      console.log('receipt', receipt)
      const transferEvent = receipt.events?.find(event => event.event === ERC721TokenEventNames.Transfer)
      if (!transferEvent) {
        throw Error(`receipt does not contain ${ERC721TokenEventNames.Transfer} event`)
      }

      const tokenIdArgIndex = 2
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
  }), [contract, signer, address, seed, factory, form, wrapPromise])

  return { ...statuses, mintNFT }
}
