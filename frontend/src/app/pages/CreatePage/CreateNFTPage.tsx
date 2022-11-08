import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import PostfixedInput from '../../UIkit/Form/PostfixedInput'
import { TextArea } from '../../UIkit/Form/Textarea'
import {
  Form,
  FormControl,
  Label,
  LabelWithCounter,
  LetterCounter,
  TextBold,
  TextGray,
  Title
} from './CreateCollectionPage'
import BoxImage from './img/box.svg'

const Description = styled('p', {
  fontSize: '12px',
  color: '$gray500',
  marginBottom: '$2'
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
    <PageLayout css={{ minHeight: '100vh', paddingBottom: '$4' }}>
      <Form>
        <Title>Create New NFT</Title>
        <FormControl>
          <Label css={{ marginBottom: '$3' }}>Upload a 3D model</Label>
          <Description>
            <TextBold>Formats:</TextBold> FBX, 3DS, MAX, BLEND, OBJ, C4D, MB,
            MA, LWO, LXO, SKP, STL, UASSET, DAE, PLY, GLB, GLTF, USDF,
            UNITYPACKAGE.
            <TextBold>Max size:</TextBold> 100 MB.
          </Description>
          <File htmlFor='inputTag'>
            <Box src={BoxImage} />
            <BoxLabel>Choose File</BoxLabel>
            <FileInput id='inputTag' type='file' />
          </File>
        </FormControl>

        <FormControl>
          <Label>Name</Label>
          <Input placeholder='Item name' />
        </FormControl>

        <FormControl>
          <Label>Price</Label>
          <PostfixedInput
            placeholder='Enter price for one piece'
            postfix='ETH'
          />
        </FormControl>

        <FormControl>
          <Label>Collection</Label>
          {/* TODO MAKE SELECT */}
          <Input placeholder='Select collection' />
        </FormControl>

        <FormControl>
          <LabelWithCounter>
            <Label>
              Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
            </Label>
            <LetterCounter>0/1000</LetterCounter>
          </LabelWithCounter>

          <TextArea placeholder='Description of your item' />
        </FormControl>

        <FormControl>
          <Label>Supply</Label>
          <Input type={'number'} placeholder='Number of copies' />
        </FormControl>

        <Button primary type='submit'>
          Mint
        </Button>
      </Form>
    </PageLayout>
  )
}
