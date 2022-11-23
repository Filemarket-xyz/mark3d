import { useState } from 'react'
import { useAfterDidMountEffect } from '../../../hooks/useDidMountEffect'
import {
  useCreateCollection,
  CreateCollectionForm as FormDataToTransfer
} from '../../../processing/hooks'
import { CreateCollectionForm } from '../CreateCollectionPage'

const convertFileListToFile = (file: FileList): File | undefined => {
  if (!file || !file.length) return
  const fileExtension = file[0].type.split('/').pop()

  return new File([file[0]], `logo.${fileExtension}`, { type: file[0].type })
}

const convertFormDataToCollectionDTO = (
  form: CreateCollectionForm
): FormDataToTransfer => {
  return {
    ...form,
    name: form.name,
    image: convertFileListToFile(form.image)
  }
}

/** This hook provides methods to mint collection from given form */
export const useMintCollection = () => {
  const [formToTransfer, setFormToTransfer] = useState<FormDataToTransfer>({
    description: '',
    image: undefined,
    name: '',
    symbol: ''
  })

  const {
    createCollection,
    statuses: { error, isLoading, result },
    setError
  } = useCreateCollection(formToTransfer)

  useAfterDidMountEffect(() => {
    void createCollection()
  }, [formToTransfer])

  return {
    error,
    setError,
    isLoading,
    result,
    mintCollection: (form: CreateCollectionForm) => {
      setFormToTransfer(convertFormDataToCollectionDTO(form))
    }
  }
}
