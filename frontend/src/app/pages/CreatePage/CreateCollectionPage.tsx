import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
import ImgIcon from './img/image-icon.svg'

const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

const SubTitle = styled('label', {
  ...textVariant('primary1').true,
  marginBottom: '$3',
  color: '$blue900',
  display: 'block'
})

const Empowered = styled('span', {
  fontWeight: 600
})

const TextGray = styled('span', {
  color: '#a1a1ab'
})

const File = styled('label', {
  borderRadius: '$3',
  display: 'inline-flex',
  gap: '$4',
  alignItems: 'center',
  marginBottom: '$4',
  cursor: 'pointer'
})

const FileImageContainer = styled('div', {
  width: 160,
  height: 152,
  backgroundColor: '$white',
  color: '$blue500',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$2',
  flexDirection: 'column',
  borderRadius: '$3',
  ...textVariant('primary1').true
})

const ImageIcon = styled('img', {
  width: 64,
  heigth: 64
})

const FileInput = styled('input', {
  display: 'none'
})

const FileDescriptionList = styled('ul', {
  ...textVariant('secondary2').true,
  color: '$gray500',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2'
})

const FileDescriptionItem = styled('li', {})

const Input = styled('input', {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  outline: 'none',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  '&:placeholder': {
    color: '#a1a1ab'
  },
  '&:focus': {
    background:
      'linear-gradient($white 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)'
  },
  width: '100%'
})

const TextArea = styled('textarea', {
  backgroundColor: '$white',
  borderRadius: '$3',
  padding: '14px $3',
  outline: 'none',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  '&:placeholder': {
    color: '#a1a1ab'
  },
  '&:focus': {
    background:
      'linear-gradient($white 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)'
  },
  width: '100%',
  resize: 'vertical'
})

const FormControl = styled('div', {
  marginBottom: '$4'
})

const Form = styled('form', {
  maxWidth: '$breakpoints$sm',
  marginLeft: 'auto',
  marginRight: 'auto'
})

const InputWithPrefix = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  outline: 'none',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  '&:placeholder': {
    color: '#a1a1ab'
  },
  '&:focus-within': {
    background:
      'linear-gradient($white 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)'
  },
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center'
})

const InputPrefix = styled('span', {
  color: '$gray500',
  ...textVariant('secondary1').true,
  fontWeight: 600
})

export default function CreateCollectionPage() {
  return (
    <PageLayout css={{ minHeight: '100vh', paddingBottom: '$4' }}>
      <Form>
        <Title>Create New Collection</Title>

        <SubTitle>Upload a Logo</SubTitle>

        <File htmlFor='inputTag'>
          <FileImageContainer>
            <ImageIcon src={ImgIcon} />
            <p>Choose photo</p>
          </FileImageContainer>
          <FileDescriptionList>
            <FileDescriptionItem>
              <Empowered>Recommended size:</Empowered> 300x300 px
            </FileDescriptionItem>
            <FileDescriptionItem>
              <Empowered>Formats:</Empowered> JPG, PNG, or GIF
            </FileDescriptionItem>
            <FileDescriptionItem>
              <Empowered>Max size:</Empowered> 100 MB
            </FileDescriptionItem>
          </FileDescriptionList>
          <FileInput id='inputTag' type='file' />
        </File>

        <FormControl>
          <SubTitle>Name</SubTitle>
          <Input placeholder='Collection name' />
        </FormControl>

        <FormControl>
          <SubTitle>Symbol</SubTitle>
          <Input placeholder='Token symbol' />
        </FormControl>

        <FormControl>
          <SubTitle>
            Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
          </SubTitle>
          <TextArea placeholder='Description of your token collection' />
        </FormControl>

        <FormControl>
          <SubTitle>URL</SubTitle>
          <InputWithPrefix>
            <InputPrefix>mark.3d/</InputPrefix>
            <Input
              css={{
                paddingLR: 0,
                borderRadius: 0,
                border: 'none',
                flexGrow: 1,
                height: '100%',
                boxShadow: 'none',
                '&:focus': {
                  boxShadow: 'none'
                }
              }}
              placeholder='Short url'
            />
          </InputWithPrefix>
        </FormControl>

        <Button type='submit' primary>
          Mint
        </Button>
      </Form>
    </PageLayout>
  )
}
