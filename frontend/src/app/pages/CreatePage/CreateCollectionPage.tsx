import { Loading } from '@nextui-org/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { styled } from '../../../styles'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import { Button, NavLink, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import { useCreateCollection } from './hooks/useCreateCollection'
import MintModal from './MintModal'

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

export const FormControl = styled('div', {
  marginBottom: '$4'
})

export const Form = styled('form', {
  maxWidth: '$breakpoints$sm',
  marginLeft: 'auto',
  marginRight: 'auto'
})

const ModalTitle = styled('h3', {
  ...textVariant('primary1'),
  fontSize: '$h5',
  color: '$blue900',
  fontWeight: 600,
  textAlign: 'center',
  paddingTop: '$3'
})

const ModalP = styled('p', {
  ...textVariant('primary1'),
  color: '$gray500',
  textAlign: 'center',
  paddingTop: '$2'
})

const InProcessBody = () => (
  <>
    <Loading size='xl' type='points' />
    <ModalTitle>Collection is being minted</ModalTitle>
    <ModalP>Please check your wallet and sign the transaction</ModalP>
  </>
)

const SuccessBody = ({ id }: { id: string }) => (
  <>
    <ModalTitle css={{ paddingTop: 0, marginBottom: '$4' }}>Success</ModalTitle>
    <NavLink
      to={`/collection/${id}`}
      css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Button primary>View collection</Button>
    </NavLink>
  </>
)

const ErrorBody = ({ message }: { message: string }) => (
  <>
    <ModalTitle css={{ paddingTop: 0 }}>Error</ModalTitle>
    <ModalP css={{ color: '$red' }}>{message}</ModalP>
  </>
)

const extractMessageFromError = (error: string) => {
  const UNKNOWN_ERROR = 'Something went wrong, try again later'

  const errorPartToShow = error.split('\n').shift()
  if (!errorPartToShow) return UNKNOWN_ERROR

  try {
    const errorObject = JSON.parse(errorPartToShow)
    return errorObject.message ?? UNKNOWN_ERROR
  } catch {
    return errorPartToShow
  }
}

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

  const { error, isLoading, result, createCollection: mintCollection, setError, setIsLoading } =
    useCreateCollection()

  const onSubmit: SubmitHandler<CreateCollectionForm> = (data) => {
    console.log(isValid)

    mintCollection(data)
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [modalBody, setModalBody] = useState<JSX.Element>()

  useAfterDidMountEffect(() => {
    if (isLoading) {
      void setModalOpen(true)
      void setModalBody(<InProcessBody />)
    } else if (result) {
      void setModalOpen(true)
      void setModalBody(<SuccessBody id={result.collectionTokenAddress} />)
    } else if (error) {
      void setModalOpen(true)
      void setModalBody(<ErrorBody message={extractMessageFromError(error)} />)
    }
    console.log(isLoading, error, result)
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
