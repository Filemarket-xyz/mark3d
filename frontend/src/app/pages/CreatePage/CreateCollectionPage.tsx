import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import PrefixedInput from '../../UIkit/Form/PrefixedInput'
import { TextArea } from '../../UIkit/Form/Textarea'
import { generateFileHoverStyles, WhiteShade } from './CreateNFTPage'
import ImgIcon from './img/image-icon.svg'

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

const File = styled('label', {
  borderRadius: '$3',
  display: 'inline-flex',
  gap: '$4',
  alignItems: 'center',
  cursor: 'pointer',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex'
  }
})

const FileImageContainer = styled('div', {
  position: 'relative',
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
  ...textVariant('primary1').true,
  ...generateFileHoverStyles()
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

export default function CreateCollectionPage() {
  return (
    <PageLayout css={{ minHeight: '100vh', paddingBottom: '$4' }}>
      <Form>
        <Title>Create New Collection</Title>

        <FormControl>
          <Label css={{ marginBottom: '$3' }}>Upload a Logo</Label>

          <File htmlFor='inputTag'>
            <FileImageContainer>
              <WhiteShade></WhiteShade>
              <ImageIcon src={ImgIcon} />
              <p>Choose photo</p>
            </FileImageContainer>
            <FileDescriptionList>
              <FileDescriptionItem>
                <TextBold>Recommended size:</TextBold> 300x300 px
              </FileDescriptionItem>
              <FileDescriptionItem>
                <TextBold>Formats:</TextBold> JPG, PNG, or GIF
              </FileDescriptionItem>
              <FileDescriptionItem>
                <TextBold>Max size:</TextBold> 100 MB
              </FileDescriptionItem>
            </FileDescriptionList>
            <FileInput id='inputTag' type='file' />
          </File>
        </FormControl>

        <FormControl>
          <Label>Name</Label>
          <Input placeholder='Collection name' />
        </FormControl>

        <FormControl>
          <Label>Symbol</Label>
          <Input placeholder='Token symbol' />
        </FormControl>

        <FormControl>
          <LabelWithCounter>
            <Label>
              Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
            </Label>
            <LetterCounter>0/1000</LetterCounter>
          </LabelWithCounter>

          <TextArea placeholder='Description of your token collection' />
        </FormControl>

        <FormControl>
          <Label>URL</Label>
          <PrefixedInput
            prefix='mark.3d/'
            placeholder='Short URL'
          ></PrefixedInput>
        </FormControl>

        <Button type='submit' primary>
          Mint
        </Button>
      </Form>
    </PageLayout>
  )
}
