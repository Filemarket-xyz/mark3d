import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { styled } from '../../../styles'
import NftLoader from '../../components/Uploaders/NftLoader/NftLoader'
import { Button, PageLayout } from '../../UIkit'
import { ControlledComboBox, ComboBoxOption } from '../../UIkit/Form/Combobox'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import {
  Form,
  Label,
  LabelWithCounter,
  LetterCounter,
  TextBold,
  TextGray,
  Title
} from './CreateCollectionPage'
import PlusIcon from './img/plus-icon.svg'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { SubmitHandler, useForm } from 'react-hook-form'
import { observer } from 'mobx-react-lite'
import { useCollectionAndTokenListStore } from '../../hooks'
import { toJS } from 'mobx'
import { useAccount } from 'wagmi'
import { useCreateNft } from './hooks/useCreateNft'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import MintModal, {
  ErrorBody,
  extractMessageFromError,
  InProgressBody,
  SuccessNavBody
} from '../../components/Modal/Modal'
import { FormControl } from '../../UIkit/Form/FormControl'
import { useModalProperties } from './hooks/useModalProperties'

const Description = styled('p', {
  fontSize: '12px',
  color: '$gray500',
  marginBottom: '$2'
})

const AddCollectionButton = styled(Button, {
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$3',
  minWidth: 0,
  padding: 0,
  backgroundColor: '$white'
})

const Icon = styled('img', {
  width: 16,
  height: 16
})

const CollectionPickerContainer = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'space-between',
  '& div:first-child': {
    flexGrow: 1
  },

  // set width to full width of form
  // calc inside calcs is taken from container props
  '& ul': {
    width: 'calc(100% - 2 * calc((100% - $breakpoints$xl) * 0.5 + $space$3))',
    '@xl': {
      width:
        'calc(100% - 2 * calc((100% - $breakpoints$lg) * 0.5 + $space$3) - $space$2 - 48px)'
    },
    '@lg': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$md) * 0.5 + $space$3))'
    },
    '@md': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$sm) * 0.5 + $space$2))'
    },
    '@sm': {
      width: 'calc(100% - 2 * $space$2)'
    }
  }
})

export interface CreateNFTForm {
  image: FileList
  hiddenFile: FileList
  name: string
  collection: ComboBoxOption
  description: string
}

const CreateNftPage = observer(() => {
  const { address } = useAccount()
  const location = useLocation()
  const predefinedCollection: {
    address: string
    name: string
  } | undefined = location.state?.collection

  const {
    collections,
    isLoading: isCollectionLoading,
    isLoaded: isCollectionLoaded
  } = useCollectionAndTokenListStore(address)

  const [collectionOptions, setCollectionOptions] = useState<ComboBoxOption[]>(
    []
  )

  const { modalBody, modalOpen, setModalBody, setModalOpen } =
    useModalProperties()

  const {
    createNft,
    error: nftError,
    isLoading: isNftLoading,
    result: nftResult,
    setError: setNftError,
    setIsLoading: setIsNftLoading
  } = useCreateNft()

  useAfterDidMountEffect(() => {
    if (!isCollectionLoaded) return

    setCollectionOptions(
      toJS(collections).map((collection) => ({
        id: collection.address ?? '',
        title: collection.name ?? ''
      }))
    )
  }, [isCollectionLoaded])

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid }
  } = useForm<CreateNFTForm>({
    defaultValues: {
      collection: predefinedCollection
        ? { id: predefinedCollection.address, title: predefinedCollection.name }
        : undefined
    }
  })

  const onSubmit: SubmitHandler<CreateNFTForm> = (data) => {
    createNft(data)
  }

  useAfterDidMountEffect(() => {
    if (isNftLoading) {
      setModalOpen(true)
      setModalBody(<InProgressBody text='NFT is being minted' />)
    } else if (nftError) {
      setModalOpen(true)
      setModalBody(<ErrorBody message={extractMessageFromError(nftError)} />)
    } else if (nftResult) {
      setModalOpen(true)
      setModalBody(
        <SuccessNavBody
          buttonText='View NFT'
          link={`/collection/${nftResult.receipt.to}/${nftResult.tokenId}`}
        />
      )
    }
  }, [nftError, isNftLoading, nftResult])

  return (
    <>
      <MintModal
        handleClose={() => {
          setIsNftLoading(false)
          setNftError(undefined)
          setModalOpen(false)
        }}
        body={modalBody ?? <></>}
        open={modalOpen}
      />
      <PageLayout css={{ paddingBottom: '$4' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Title>Create New NFT</Title>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a preview</Label>
            <ImageLoader
              registerProps={register('image', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a 3D model that will be hidden</Label>
            <Description>
              <TextBold>Formats:</TextBold> FBX, 3DS, MAX, BLEND, OBJ, C4D, MB,
              MA, LWO, LXO, SKP, STL, UASSET, DAE, PLY, GLB, GLTF, USDF,
              UNITYPACKAGE.
              <TextBold>Max size:</TextBold> 100 MB.
            </Description>
            <NftLoader
              registerProps={register('hiddenFile', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label>Name</Label>
            <Input
              placeholder='Item name'
              {...register('name', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label>Collection</Label>
            <CollectionPickerContainer>
              <ControlledComboBox<CreateNFTForm>
                name='collection'
                control={control}
                comboboxProps={{
                  options: collectionOptions,
                  isLoading: isCollectionLoading
                }}
                rules={{ required: true }}
              />
              <NavLink to={'../collection'}>
                <AddCollectionButton>
                  <Icon src={PlusIcon} />
                </AddCollectionButton>
              </NavLink>
            </CollectionPickerContainer>
          </FormControl>

          <FormControl>
            <LabelWithCounter>
              <Label>
                Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter>0/1000</LetterCounter>
            </LabelWithCounter>

            <TextArea
              placeholder='Description of your item'
              {...register('description')}
            />
          </FormControl>

          <Button
            primary
            type='submit'
            isDisabled={!isValid}
            title={isValid ? undefined : 'Required fields must be filled'}
          >
            Mint
          </Button>
        </Form>
      </PageLayout>
    </>
  )
})

export default CreateNftPage
