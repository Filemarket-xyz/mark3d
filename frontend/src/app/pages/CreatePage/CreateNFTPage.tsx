import { Input } from '@nextui-org/react'
import React from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant } from '../../UIkit'
import BoxImage from './img/box.svg'

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
  width: '100%',
  height: '232px',
  backgroundColor: '$white',
  borderRadius: '16px',
  backgroundImage: 'url("./img/box.svg")',
  backgroundSize: '56px 45px',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$3',
  marginBottom: '$2',
  cursor: 'pointer'
})

const Box = styled('img', {
  width: 80,
  height: 80
})

const FileInput = styled('input', {
  display: 'none'
})

const BoxLabel = styled('span', {
  ...textVariant('primary1').true,
  color: '$blue500',
  fontWeight: 600
})

export default function CreateNftPage() {
  return (
    <PageLayout css={{ minHeight: '100vh' }}>
      <Title>Create New NFT</Title>

      <SubTitle>Upload a 3D model</SubTitle>
      <Description>
        <Empowered>Formats:</Empowered> FBX, 3DS, MAX, BLEND, OBJ, C4D, MB, MA,
        LWO, LXO, SKP, STL, UASSET, DAE, PLY, GLB, GLTF, USDF, UNITYPACKAGE.{' '}
        <Empowered>Max size:</Empowered> 100 MB.
      </Description>
      <File htmlFor='inputTag'>
        <Box src={BoxImage} />
        <BoxLabel>Choose File</BoxLabel>
        <FileInput id='inputTag' type='file' />
      </File>
      <SubTitle>Name</SubTitle>
      <Input css={{ backgroundColor: '#fff' }} placeholder='Item name' />
    </PageLayout>
  )
}
