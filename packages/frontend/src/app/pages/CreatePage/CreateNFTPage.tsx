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
import { useCollectionAndTokenListStore, useStores } from '../../hooks'
import { useAfterDidMountEffect } from '../../hooks/useDidMountEffect'
import { useMediaMui } from '../../hooks/useMediaMui'
import { Button, Link, PageLayout, textVariant, Txt } from '../../UIkit'
import { ComboBoxOption, ControlledComboBox } from '../../UIkit/Form/Combobox'
import { FormControl } from '../../UIkit/Form/FormControl'
import { Input } from '../../UIkit/Form/Input'
import { TextArea } from '../../UIkit/Form/Textarea'
import TagsSection from '../NFTPage/section/Tags/TagsSection'
import {
  ButtonContainer,
  Form,
  Label,
  LabelWithCounter,
  LetterCounter,
  TextBold,
  TextGray
} from './CreateCollectionPage'
import { category, categoryOptions, license, licenseInfo, licenseOptions, subcategory, tags } from './helper/data/data'
import { useCreateNft } from './hooks/useCreateNft'
import { useModalProperties } from './hooks/useModalProperties'
import PlusIcon from './img/plus-icon.svg'

const Description = styled('div', {
  ...textVariant('secondary1').true,
  fontSize: '14px',
  lineHeight: '18px',
  color: '$gray600',
  marginBottom: '$3',
  variants: {
    secondary: {
      true: {
        ...textVariant('primary1').true,
        fontWeight: '400'
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
  backgroundColor: '$white',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)'
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

const TitleGroup = styled(FormControl, {
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
  }
})

const ContentField = styled(CollectionPickerContainer, {
  padding: '$3',
  border: '1px solid #e9e9e9',
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

const NFTLicense = styled('div', {
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

  const {
    collectionMintOptions,
    isLoading: isCollectionLoading
  } = useCollectionAndTokenListStore(address)

  const { collectionAndTokenList } = useStores()

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
  const { adaptive } = useMediaMui()
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
  const description = watch('description')

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

  const saveValue = (value: string | undefined) => {
    if (value && !chosenTags.includes(value)) {
      setChosenTags([...chosenTags, value])
      resetField('tags')
    }
  }

  return (
    <>
      <MintModal
        body={modalBody ?? <></>}
        open={modalOpen}
        handleClose={() => {
          setIsNftLoading(false)
          setNftError(undefined)
          setModalOpen(false)
        }}
      />
      <PageLayout css={{ paddingBottom: '$4' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TitleGroup>
            <h3><Txt h3>Create New EFT</Txt></h3>
            <SubTitle>
              <Txt primary1>
                <Tooltip
                  placement={'bottom'}
                  content={(
                    <Txt secondary1 css={{ fontSize: '14px' }}>
                      Allows users to mint EFTs with attached encrypted files of any size stored on Filecoin,
                      which can only be accessed exclusively by the owner of the EFT.
                    </Txt>
                  )}
                  css={{
                    width: `${adaptive({
                      sm: '300px',
                      md: '400px',
                      defaultValue: '544px'
                    })}`
                  }}
                >
                  {' '}
                  <Txt css={{ color: '$blue500', cursor: 'pointer' }}>Encrypted FileToken&#169;</Txt>
                  {' '}
                </Tooltip>
                on Filecoin network
              </Txt>
            </SubTitle>
          </TitleGroup>

          <FormControl>
            <Label css={{ marginBottom: '$1' }}>Upload a public preview picture</Label>
            <Description>
              <TextBold>Formats:</TextBold>
              {' '}
              JPG, PNG or GIF.
              <TextBold> Max size:</TextBold>
              {' '}
              100 MB.
            </Description>
            <ImageLoader
              registerProps={register('image', { required: true })}
            />
          </FormControl>

          <FormControl>
            <Label css={{ marginBottom: '$1' }}>Upload any file that will be encrypted and hidden by EFT Protocol</Label>
            <Description>
              <TextBold>Formats:</TextBold>
              {' '}
              Any.
              <TextBold> Max size:</TextBold>
              {' '}
              1 GB.
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
                rules={{ required: true }}
                comboboxProps={{
                  options: collectionMintOptions,
                  isLoading: isCollectionLoading
                }}
                onFocus={() => {
                  collectionAndTokenList.reload()
                }}
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
                Description&nbsp;&nbsp;
                <TextGray>(Optional)</TextGray>
              </Label>
              <LetterCounter
                style={{
                  color: description?.length > 1000 ? '#D81B60' : '#A7A8A9'
                }}
              >
                {description?.length}
                /1000
              </LetterCounter>
            </LabelWithCounter>

            <TextArea
              placeholder='Description of your item'
              {...register('description', { maxLength: { value: 1000, message: 'Aboba' } })}
            />
          </FormControl>

          <FormControl>
            <CategoryAndSubcategory>
              <div>
                <Label>Category</Label>
                <CollectionPickerContainer>
                  <ControlledComboBox<CreateNFTForm>
                    name='category'
                    control={control}
                    placeholder={'Select a category'}
                    rules={{ required: true }}
                    size={'md'}
                    comboboxProps={{
                      options: categoryOptions
                    }}
                  />
                </CollectionPickerContainer>
              </div>

              <div>
                <Label>
                  Subcategory&nbsp;&nbsp;
                  <TextGray>(Optional)</TextGray>
                </Label>
                <CollectionPickerContainer>
                  <ControlledComboBox<CreateNFTForm>
                    name='subcategory'
                    control={control}
                    placeholder={'Select a subcategory'}
                    rules={{ required: false }}
                    isDisabled={!category}
                    size={'md'}
                    comboboxProps={{
                      options: subcategoryOptions
                    }}
                  />
                </CollectionPickerContainer>
              </div>
            </CategoryAndSubcategory>
          </FormControl>

          <FormControl size={'lg'}>
            <Label paddingL>
              Tags&nbsp;&nbsp;
              <TextGray>(Optional)</TextGray>
            </Label>
            <ContentField>
              <ControlledComboBox<CreateNFTForm>
                name='tags'
                control={control}
                placeholder={'Content tags'}
                rules={{ required: false }}
                rightContent={<Txt primary1 style={{ cursor: 'pointer', color: '#0090FF' }}>Save</Txt>}
                comboboxProps={{
                  options: tags?.filter((tag) => !chosenTags.includes(tag.title))
                }}
                onClickRightContent={saveValue}
                onEnter={saveValue}
              />
              {chosenTags.length > 0 && (
                <TagsSection
                  tags={chosenTags}
                  tagOptions={{
                    isCanDelete: true,
                    onDelete: (value?: string) => {
                      if (value === chosenTag?.title) {
                        resetField('tags')
                      }
                      setChosenTags([...chosenTags?.filter((tag) => {
                        return tag !== value
                      })])
                    }
                  }}
                />
              )}
              {chosenTags.length <= 0 && (
                <Description secondary>
                  Tags make it easier to find the right content
                </Description>
              )}
            </ContentField>
          </FormControl>

          <FormControl size={'lg'}>
            <Label paddingL>License</Label>
            <ContentField>
              <ControlledComboBox<CreateNFTForm>
                name='license'
                control={control}
                placeholder={'License'}
                rules={{ required: true }}
                comboboxProps={{
                  options: licenseOptions
                }}
              />
              <Description secondary style={{ marginBottom: '0', padding: '0 16px' }}>
                <Txt style={{ fontWeight: '500', color: '#232528' }}>{licenseDescription.split(' ')[0]}</Txt>
                &nbsp;
                {licenseDescription.split(' ').slice(1, licenseDescription.split(' ').length - 1).join(' ')}
                <NFTLicense style={{ marginTop: '8px' }}>
                  <Link
                    iconRedirect
                    style={{ fontWeight: '500' }}
                    href={licenseUrl}
                    target="_blank"
                  >
                    About CC Licenses
                  </Link>
                </NFTLicense>
              </Description>
            </ContentField>
          </FormControl>

          <ButtonContainer>
            <Button
              primary
              type='submit'
              isDisabled={!isValid}
              title={isValid ? undefined : 'Required fields must be filled'}
              css={{
                width: '320px'
              }}
            >
              Mint
            </Button>
          </ButtonContainer>
        </Form>
      </PageLayout>
    </>
  )
})

export default CreateNftPage
