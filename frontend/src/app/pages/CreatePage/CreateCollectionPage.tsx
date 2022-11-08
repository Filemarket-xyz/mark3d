import { Input } from '@nextui-org/react'
import React from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant } from '../../UIkit'
import ImgIcon from './img/image-icon.svg'

const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

const SubTitle = styled('h2', {
  ...textVariant('primary1').true,
  marginBottom: '$3'
})

const Description = styled('p', {
  fontSize: '12px',
  color: '$gray500',
  marginBottom: '$2'
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

export default function CreateCollectionPage() {
  return (
    <PageLayout css={{ minHeight: '100vh' }}>
      <Title>Create New Collection</Title>

      <SubTitle>Upload a Logo</SubTitle>
      <Description>
        <Empowered>Formats:</Empowered> FBX, 3DS, MAX, BLEND, OBJ, C4D, MB, MA,
        LWO, LXO, SKP, STL, UASSET, DAE, PLY, GLB, GLTF, USDF, UNITYPACKAGE.{' '}
        <Empowered>Max size:</Empowered> 100 MB.
      </Description>
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
      <Input css={{ backgroundColor: '#fff' }} placeholder='Item name' />
    </PageLayout>
  )
}