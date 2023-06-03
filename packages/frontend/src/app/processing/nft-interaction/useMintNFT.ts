import { BigNumber, ContractReceipt } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

import { api } from '../../config/api'
import { mark3dConfig } from '../../config/mark3d'
import { useStatusState } from '../../hooks'
import { useCollectionContract } from '../contracts'
import { useHiddenFileProcessorFactory } from '../HiddenFileProcessorFactory'
import { FileMeta } from '../types'
import { assertAccount, assertContract, assertSigner, callContract, callContractGetter } from '../utils'
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

export function useMintNFT(form: MintNFTForm = {}, options?: { isPublicCollection?: boolean }) {
  const { contract, signer } = useCollectionContract(form.collectionAddress)
  const { address } = useAccount()
  const { wrapPromise, ...statuses } = useStatusState<MintNFTResult>()
  const factory = useHiddenFileProcessorFactory()
  const upload = useUploadLighthouse()

  const mintNFT = useCallback(wrapPromise(async () => {
    assertContract(contract, mark3dConfig.collectionToken.name)
    assertSigner(signer)
    assertAccount(address)

    const { name, description, image, hiddenFile, collectionAddress, license, tags, subcategories, categories } = form
    if (!name || !collectionAddress || !image || !hiddenFile) {
      throw Error('CreateCollection form is not filled')
    }

    let tokenIdBN: BigNumber
    if (options?.isPublicCollection) {
      const { data } = await api.sequencer.acquireDetail(collectionAddress)
      tokenIdBN = BigNumber.from(data.tokenId)
    } else {
      tokenIdBN = await callContractGetter<BigNumber>({ contract, method: 'tokensCount' })
    }
    const owner = await factory.getOwner(address, collectionAddress, tokenIdBN.toNumber())

    const hiddenFileEncrypted = await owner.encryptFile(hiddenFile)
    const hiddenFileMeta: FileMeta = {
      name: hiddenFile.name,
      type: hiddenFile.type,
      size: hiddenFile.size,
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
      subcategories,
    })
    console.log('mint metadata', metadata)

    const receipt = await callContract({ contract, signer, method: 'mint' },
      address,
      tokenIdBN,
      metadata.url,
      '100', // TODO: update
      '0x00',
    )

    return {
      tokenId: tokenIdBN.toString(),
      receipt,
    }
  }), [contract, signer, address, factory, form, wrapPromise, options])

  return { ...statuses, mintNFT }
}
