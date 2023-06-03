import { useState } from 'react'

import { useAfterDidMountEffect } from '../../../hooks/useDidMountEffect'
import {
  MintNFTForm as FormToTransfer,
  useMintNFT,
} from '../../../processing/nft-interaction'
import { CreateNFTForm } from '../CreateNFTPage'

const convertFormDataToNftDTO = (form: CreateNFTForm): FormToTransfer => {
  return {
    name: form.name,
    collectionAddress: form.collection.id,
    description: form.description,
    hiddenFile: form.hiddenFile[0],
    image: form.image[0],
    categories: [form.category.title],
    subcategories: [form.subcategory?.title],
    license: form.license.title,
    licenseUrl: form.licenseUrl,
    tags: form.tagsValue,
  }
}

/** This hook is a wrapper above useMintNft hook. It provides methods to mint collection from given raw form */
export const useCreateNft = () => {
  const [formToTransfer, setFormToTransfer] = useState<FormToTransfer>({
    collectionAddress: '',
    description: '',
    hiddenFile: undefined,
    image: undefined,
    name: '',
  })
  const [options, setOptions] = useState<{ isPublicCollection?: boolean }>()

  const {
    mintNFT,
    setError,
    setIsLoading,
    setResult,
    statuses: { error, isLoading, result },
  } = useMintNFT(formToTransfer, options)

  useAfterDidMountEffect(() => {
    console.log(formToTransfer.description)
    mintNFT()
  }, [formToTransfer, options])

  return {
    createNft: (form: CreateNFTForm, options?: { isPublicCollection?: boolean }) => {
      setOptions(options)
      setFormToTransfer(convertFormDataToNftDTO(form))
    },
    error,
    setError,
    isLoading,
    setIsLoading,
    result,
    setResult,
  }
}
