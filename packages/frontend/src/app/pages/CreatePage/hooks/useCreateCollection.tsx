import { useState } from 'react'

import { useAfterDidMountEffect } from '../../../hooks/useDidMountEffect'
import {
  CreateCollectionForm as FormDataToTransfer,
  useMintCollection,
} from '../../../processing/nft-interaction'
import { CreateCollectionForm } from '../CreateCollectionPage'

const convertFormDataToCollectionDTO = (
  form: CreateCollectionForm,
): FormDataToTransfer => {
  return {
    ...form,
    name: form.name,
    image: form.image[0],
  }
}

/** This hook is a wrapper above useMintCollection hook. It provides methods to mint collection from given raw form */
export const useCreateCollection = () => {
  const [formToTransfer, setFormToTransfer] = useState<FormDataToTransfer>({
    description: '',
    image: undefined,
    name: '',
    symbol: '',
  })

  const {
    statuses: { error, isLoading, result },
    setError,
    setIsLoading,
    mintCollection,
  } = useMintCollection()

  useAfterDidMountEffect(() => {
    mintCollection(formToTransfer)
  }, [formToTransfer])

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    result,
    createCollection: (form: CreateCollectionForm) => {
      setFormToTransfer(convertFormDataToCollectionDTO(form))
    },
  }
}
