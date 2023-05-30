import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { styled } from '../../../styles'
import MintModal, {
  ErrorBody,
  extractMessageFromError,
  InProgressBody,
  SuccessNavBody,
} from '../../components/Modal/Modal'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { FormControl } from '../../UIkit/Form/FormControl'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import { useCreateCollection } from './hooks/useCreateCollection'
import { useModalProperties } from './hooks/useModalProperties'

export const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4',
})

export const Label = styled('label', {
  ...textVariant('primary1').true,
  lineHeight: '16px',
  marginBottom: '$2',
  color: '$gray800',
  display: 'block',
  variants: {
    paddingL: {
      true: {
        paddingLeft: '$3',
        '@sm': {
          paddingLeft: 0,
        },
      },
    },
  },
})

export const TextBold = styled('span', {
  ...textVariant('primary1').true,
  fontSize: '12px',
  fontWeight: 600,
})

export const TextGray = styled('span', {
  color: '$gray400',
})

export const LabelWithCounter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const LetterCounter = styled('span', {
  display: 'block',
  ...textVariant('secondary3').true,
  color: '$gray400',
})

export const Form = styled('form', {
  maxWidth: 'calc($breakpoints$sm + 32px)',
  marginLeft: 'auto',
  marginRight: 'auto',
})

export const ButtonContainer = styled('div', {
  paddingTop: '$3',
  paddingLeft: '$3',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  paddingBottom: '90px',
  '@md': {
    paddingBottom: '70px',
  },
  '@sm': {
    paddingLeft: 0,
    justifyContent: 'center',
  },
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
    getValues,
    resetField,
  } = useForm<CreateCollectionForm>()

  const {
    error,
    isLoading,
    result,
    createCollection: mintCollection,
  } = useCreateCollection()

  const onSubmit: SubmitHandler<CreateCollectionForm> = (data) => {
    mintCollection(data)
  }

  const { modalBody, setModalBody, modalOpen, setModalOpen } =
    useModalProperties()

  useEffect(() => {
    if (!isLoading) return

    void setModalBody(<InProgressBody text='Collection is being minted' />)
    void setModalOpen(true)
  }, [isLoading])

  useEffect(() => {
    if (!result) return

    void setModalBody(
      <SuccessNavBody
        buttonText='View collection'
        link={`/collection/${result.collectionTokenAddress}`}
      />,
    )
    void setModalOpen(true)
  }, [result])

  useEffect(() => {
    if (!error) return

    void setModalBody(<ErrorBody message={extractMessageFromError(error)} />)
    void setModalOpen(true)
  }, [error])

  const [textareaLength, setTextareaLength] = useState(
    getValues('description')?.length ?? 0,
  )

  return (
    <>
      <MintModal
        body={modalBody}
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false)
        }}
      />
      <PageLayout css={{ minHeight: '100vh' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Title>Create New Collection</Title>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a Logo</Label>
            <ImageLoader
              registerProps={register('image', { required: true })}
              resetField={resetField}
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
                Description&nbsp;&nbsp;
                <TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter>
                {textareaLength}
                /1000
              </LetterCounter>
            </LabelWithCounter>

            <TextArea
              {...register('description', {
                onChange(event) {
                  setTextareaLength(event?.target?.value?.length ?? 0)
                },
                maxLength: 1000,
              })}
              placeholder='Description of your token collection'
            />
          </FormControl>

          <ButtonContainer>
            <Button
              primary
              type='submit'
              isDisabled={!isValid}
              title={isValid ? undefined : 'Required fields must be filled'}
            >
              Mint
            </Button>
          </ButtonContainer>
        </Form>
      </PageLayout>
    </>
  )
}
