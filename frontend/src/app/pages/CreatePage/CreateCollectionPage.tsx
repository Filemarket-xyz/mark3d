import { Loading } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { styled } from '../../../styles'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import { useMintCollection } from './hooks/useMintCollection'
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

const SuccessBody = () => (
  <>
    <ModalTitle css={{ paddingTop: 0 }}>Success</ModalTitle>
    <ModalP>You can view your link here</ModalP>
  </>
)

const ErrorBody = () => (
  <>
    <ModalTitle css={{ paddingTop: 0 }}>Error</ModalTitle>
    <ModalP>Something went wrong</ModalP>
  </>
)

export interface CreateCollectionForm {
  image: FileList
  name: string
  symbol: string
  description: string
}

export default function CreateCollectionPage() {
  const { register, handleSubmit } = useForm<CreateCollectionForm>()

  const { error, isLoading, result, mintCollection } = useMintCollection()

  const onSubmit: SubmitHandler<CreateCollectionForm> = (data) => {
    mintCollection(data)
  }

  const [modalOpen, setModalOpen] = useState(true)
  const [modalBody, setModalBody] = useState(InProcessBody)

  useAfterDidMountEffect(() => {
    if (isLoading) {
      void setModalOpen(true)
      void setModalBody(InProcessBody)
    } else if (result) {
      void setModalOpen(true)
      void setModalBody(SuccessBody)
    } else if (error) {
      void setModalOpen(true)
      void setModalBody(ErrorBody)
    }
    console.log(isLoading, error, result)
  }, [error, isLoading, result])

  return (
    <>
      <MintModal
        body={() => modalBody}
        handleClose={() => setModalOpen(false)}
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
            <ImageLoader registerProps={register('image')} />
          </FormControl>

          <FormControl>
            <Label>Display name</Label>
            <Input placeholder='Collection name' {...register('name')} />
          </FormControl>

          <FormControl>
            <Label>Symbol</Label>
            <Input placeholder='Token symbol' {...register('symbol')} />
          </FormControl>

          <FormControl>
            <LabelWithCounter>
              <Label>
                Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter>0/1000</LetterCounter>
            </LabelWithCounter>

            <TextArea
              {...register('description')}
              placeholder='Description of your token collection'
            />
          </FormControl>

          <Button type='submit' primary>
            Mint
          </Button>
        </Form>
      </PageLayout>
    </>
  )
}
