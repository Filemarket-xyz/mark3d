import { ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { ERC721TokenEventNames, FileMeta } from '../types'
import { globalSaltMock, hexToBuffer } from '../utils'
import { assertAccount, assertContract, assertSigner } from '../utils/assert'
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
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult>()
  const factory = useHiddenFileProcessorFactory()
  const upload = useUploadLighthouse()

  const mintNFT = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertAccount(address)

    const { name, description, image, hiddenFile, collectionAddress } = form
    if (!name || !collectionAddress || !image || !hiddenFile) {
      throw Error('CreateCollection form is not filled')
    }

    const owner = await factory.getOwner(address)
    const tokenCountBN = await contract.tokensCount()

    const hiddenFileEncrypted = await owner.encryptFile(
      hiddenFile,
      globalSaltMock,
      hexToBuffer(collectionAddress),
      tokenCountBN.toNumber()
    )
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
    console.log({ receipt })
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

    return {
      tokenId,
      receipt
    }
  }), [contract, signer, address, factory, form, wrapPromise])

  return { ...statuses, mintNFT }
}
