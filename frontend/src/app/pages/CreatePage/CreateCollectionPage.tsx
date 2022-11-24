import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { styled } from '../../../styles'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import { useCreateCollection } from './hooks/useCreateCollection'
import MintModal, {
  ErrorBody,
  extractMessageFromError,
  InProgressBody,
  SuccessBody
} from '../../components/Modal/Modal'
import { FormControl } from '../../UIkit/Form/FormControl'
import { useModalProperties } from './hooks/useModalProperties'

export const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

export const Label = styled('label', {
  ...textVariant('primary1').true,
  marginBottom: '$2',
  color: '$blue900',
  display: 'block'
})

export const TextBold = styled('span', {
  fontWeight: 600
})

export const TextGray = styled('span', {
  color: '$gray400'
})

export const LabelWithCounter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const LetterCounter = styled('span', {
  display: 'block',
  ...textVariant('secondary3').true,
  color: '$gray400'
})

export const Form = styled('form', {
  maxWidth: '$breakpoints$sm',
  marginLeft: 'auto',
  marginRight: 'auto'
})

export interface CreateCollectionForm {
  image: FileList
  name: string
  symbol: string
  description: string
}

export default function CreateCollectionPage() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues
  } = useForm<CreateCollectionForm>()

  const {
    error,
    isLoading,
    result,
    createCollection: mintCollection,
    setError,
    setIsLoading
  } = useCreateCollection()

  const onSubmit: SubmitHandler<CreateCollectionForm> = (data) => {
    mintCollection(data)
  }

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  useEffect(() => {
    if (!(result || error || isLoading)) return

    if (isLoading) {
      void setModalBody(<InProgressBody text='Collection is being minted' />)
    } else if (result) {
      void setModalBody(
        <SuccessBody
          buttonText='View collection'
          link={`/collection/${result.collectionTokenAddress}`}
        />
      )
    } else if (error) {
      void setModalBody(<ErrorBody message={extractMessageFromError(error)} />)
    }

    setModalOpen(true)
  }, [error, isLoading, result])

  const [textareaLength, setTextareaLength] = useState(
    getValues('description')?.length ?? 0
  )

  return (
    <>
      <MintModal
        body={modalBody ?? <></>}
        handleClose={() => {
          setIsLoading(false)
          setError(undefined)
          setModalOpen(false)
        }}
        open={modalOpen}
      />
      <PageLayout
        css={{
          minHeight: '100vh',
          paddingBottom: '$4'
        }}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Title>Create New Collection</Title>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a Logo</Label>
            <ImageLoader
              registerProps={register('image', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label>Display name</Label>
            <Input
              placeholder='Collection name'
              {...register('name', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label>Symbol</Label>
            <Input
              placeholder='Token symbol'
              {...register('symbol', { required: true })}
            />
          </FormControl>

          <FormControl>
            <LabelWithCounter>
              <Label>
                Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter>{textareaLength}/1000</LetterCounter>
            </LabelWithCounter>

            <TextArea
              {...register('description', {
                onChange(event) {
                  setTextareaLength(event?.target?.value?.length ?? 0)
                },
                maxLength: 1000
              })}
              placeholder='Description of your token collection'
            />
          </FormControl>

          <Button
            type='submit'
            primary
            isDisabled={!isValid}
            title={isValid ? undefined : 'Required fields must be filled'}
          >
            Mint
          </Button>
        </Form>
      </PageLayout>
    </>
  )
}
