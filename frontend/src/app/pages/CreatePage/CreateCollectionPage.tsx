import React from 'react'
import { styled } from '../../../styles'
import { Container, PageLayout, textVariant } from '../../UIkit'
import ImgIcon from './img/image-icon.svg'

const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

const SubTitle = styled('h2', {
  ...textVariant('primary1').true,
  marginBottom: '$3'
})

const Empowered = styled('span', {
  fontWeight: 600
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
  padding: '14px $3',
  outline: 'none',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  '&:placeholder': {
    color: 'rgba($white, 0.6)'
  },
  '&:focus': {
    background:
      'linear-gradient($white 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)'
  },
  width: '100%'
})

export default function CreateCollectionPage() {
  return (
    <PageLayout css={{ minHeight: '100vh' }}>
      <Container
        css={{
          maxWidth: '$breakpoints$sm',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
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
        <SubTitle>Name</SubTitle>
        <Input placeholder='Collection name' />
      </Container>
    </PageLayout>
  )
}
