import { Tooltip } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { styled } from '../../../styles'
import MintModal, {
  ErrorBody,
  extractMessageFromError,
  InProgressBody,
  SuccessNavBody
} from '../../components/Modal/Modal'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import NftLoader from '../../components/Uploaders/NftLoader/NftLoader'
import { useCollectionAndTokenListStore } from '../../hooks'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import { Button, Link, PageLayout, Txt } from '../../UIkit'
import { ComboBoxOption, ControlledComboBox } from '../../UIkit/Form/Combobox'
import { FormControl } from '../../UIkit/Form/FormControl'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import TagsSection from '../NFTPage/section/Tags/TagsSection'
import { Form, Label, LabelWithCounter, TextBold, TextGray } from './CreateCollectionPage'
import { category, categoryOptions, license, licenseInfo, licenseOptions, subcategory } from './helper/data/data'
import { useCreateNft } from './hooks/useCreateNft'
import { useModalProperties } from './hooks/useModalProperties'
import PlusIcon from './img/plus-icon.svg'

const Description = styled('p', {
  fontSize: '12px',
  color: '$gray600',
  marginBottom: '$2',
  variants: {
    secondary: {
      true: {
        fontSize: '14px'
      }
    }
  }
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
      width: 'calc(100% - 2 * calc((100% - $breakpoints$md) * 0.5 + $space$4))'
    },
    '@md': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$sm) * 0.5 + $space$3))'
    },
    '@sm': {
      width: 'calc(100% - 2 * $space$3)'
    }
  }
})

const TitleGroup = styled('div', {
  marginBottom: '$4'
})

const SubTitle = styled('div', {
  color: '$gray600'
})

const CategoryAndSubcategory = styled('div', {
  display: 'flex',
  gap: '30px',
  '@sm': {
    flexDirection: 'column',
    gap: 0
  },
  '& ul': {
    maxWidth: '285px'
  }
})

const ContentField = styled(CollectionPickerContainer, {
  padding: '$3',
  border: '3px solid #e9e9e9',
  borderRadius: '20px',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$3',
  '& ul': {
    maxWidth: '562px',
    '@lg': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$md) * 0.5 + $space$5))'
    },
    '@md': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$sm) * 0.5 + $space$4))'
    },
    '@sm': {
      width: 'calc(100% - 2 * $space$4)'
    }
  }

})

const NFTLicense = styled('h5', {
  '& a': {
    fontSize: '14px'
  }
})

export interface CreateNFTForm {
  image: FileList
  hiddenFile: FileList
  name: string
  collection: ComboBoxOption
  description: string
  tags: ComboBoxOption
  category: ComboBoxOption
  subcategory: ComboBoxOption
  license: ComboBoxOption
  licenseUrl: string
  tagsValue: string[]
}

const CreateNftPage = observer(() => {
  const { address } = useAccount()
  const location = useLocation()
  const predefinedCollection: {
    address: string
    name: string
  } | undefined = location.state?.collection

  const [chosenTags, setChosenTags] = useState<string[]>([])
  const tags: ComboBoxOption[] = [
    {
      title: 'VR',
      id: '0'
    },
    {
      title: 'AR',
      id: '1'
    },
    {
      title: 'Stream',
      id: '2'
    },
    {
      title: 'Minecraft',
      id: '3'
    },
    {
      title: 'Amogus',
      id: '4'
    },
    {
      title: 'RockPaper',
      id: '5'
    }

  ]

  const {
    collectionMintOptions,
    isLoading: isCollectionLoading
  } = useCollectionAndTokenListStore(address)

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

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
    resetField,
    watch
  } = useForm<CreateNFTForm>({
    defaultValues: {
      collection: predefinedCollection
        ? { id: predefinedCollection.address, title: predefinedCollection.name }
        : undefined,
      license: { id: licenseOptions[0].id, title: licenseOptions[0].title }
    }
  })

  const chosenTag = watch('tags')
  const chosenCategory = watch('category')
  const license = watch('license')
  const category = watch('category')

  const onSubmit: SubmitHandler<CreateNFTForm> = (data) => {
    createNft({ ...data, tagsValue: chosenTags, licenseUrl })
  }

  useEffect(() => {
    if (chosenTag && !chosenTags.includes(chosenTag.title)) setChosenTags([...chosenTags, chosenTag.title])
  }, [chosenTag])

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

  const subcategoryOptions: ComboBoxOption[] = useMemo(() => {
    return subcategory[chosenCategory?.title as category]
  }, [chosenCategory])

  const licenseDescription = useMemo(() => {
    return licenseInfo[license?.title as license] ? licenseInfo[license?.title as license].description : 'Tags make it easier to find the right content'
  }, [license])

  const licenseUrl = useMemo(() => {
    return licenseInfo[license?.title as license] ? licenseInfo[license?.title as license].src : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }, [license])

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
          <TitleGroup>
            <h3><Txt h3>Create New NFT</Txt></h3>
            <SubTitle>
              <Txt primary1>With Encrypted
                <Tooltip
                  content={<Txt>Allows users to mint NFTs with attached encrypted files of any size stored on Filecoin,
                    which can only be accessed exclusively by the owner of the NFT.</Txt>}>
                  {' '}<Txt css={{ fontWeight: 700 }}>FileToken&#169;</Txt>{' '}
                </Tooltip>
                Technology on Filecoin storage.</Txt>
            </SubTitle>
          </TitleGroup>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload a preview picture</Label>
            <ImageLoader
              registerProps={register('image', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label css={{ marginBottom: '$3' }}>Upload any file that will be encrypted and hidden by EFT&#169;</Label>
            <Description>
              <TextBold>Formats:</TextBold> Any
              <TextBold> Max size:</TextBold> 100 MB.
            </Description>
            <NftLoader
              registerProps={register('hiddenFile', { required: true })}
              resetField={resetField}
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
                  options: collectionMintOptions,
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
              {/* <LetterCounter>{description?.length}/1000</LetterCounter> */}
            </LabelWithCounter>

            <TextArea
              placeholder='Description of your item'
              {...register('description', { maxLength: { value: 1000, message: 'Aboba' } })}
            />
          </FormControl>

          <CategoryAndSubcategory>
            <FormControl>
              <Label>Category</Label>
              <CollectionPickerContainer>
                <ControlledComboBox<CreateNFTForm>
                  name='category'
                  control={control}
                  placeholder={'Select a category'}
                  comboboxProps={{
                    options: categoryOptions
                  }}
                  rules={{ required: true }}
                />
              </CollectionPickerContainer>
            </FormControl>

            <FormControl>
              <Label>Subcategory&nbsp;&nbsp;<TextGray>(Optional)</TextGray></Label>
              <CollectionPickerContainer>
                <ControlledComboBox<CreateNFTForm>
                  name='subcategory'
                  control={control}
                  placeholder={'Select a subcategory'}
                  comboboxProps={{
                    options: subcategoryOptions
                  }}
                  rules={{ required: false }}
                  isDisabled={!category}
                />
              </CollectionPickerContainer>
            </FormControl>
          </CategoryAndSubcategory>

          <FormControl>
            <Label>Tags&nbsp;&nbsp;<TextGray>(Optional)</TextGray></Label>
            <ContentField>
              <ControlledComboBox<CreateNFTForm>
                name='tags'
                control={control}
                placeholder={'Content tags'}
                comboboxProps={{
                  options: tags?.filter((tag) => !chosenTags.includes(tag.title))
                }}
                rules={{ required: false }}
                onEnter={(value) => {
                  if (value && !chosenTags.includes(value)) setChosenTags([...chosenTags, value])
                  console.log(value)
                }}
              />
              {chosenTags.length > 0 && <TagsSection tags={chosenTags} tagOptions={{
                isCanDelete: true,
                onDelete: (value?: string) => {
                  if (value === chosenTag?.title) {
                    resetField('tags')
                  }
                  setChosenTags([...chosenTags?.filter((tag) => {
                    return tag !== value
                  })])
                }
              }} />}
              {chosenTags.length <= 0 && <Description secondary>
                Tags make it easier to find the right content
              </Description>}
            </ContentField>
          </FormControl>

          <FormControl>
            <Label>License</Label>
            <ContentField>
              <ControlledComboBox<CreateNFTForm>
                name='license'
                control={control}
                placeholder={'License'}
                comboboxProps={{
                  options: licenseOptions
                }}
                rules={{ required: true }}
              />
              <Description secondary>
                {licenseDescription}
              </Description>
              <NFTLicense><Link href={licenseUrl} target="_blank" iconRedirect={true}>About CC Licenses</Link></NFTLicense>
            </ContentField>
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
