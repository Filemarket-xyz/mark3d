import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import PrefixedInput from '../../UIkit/Form/PrefixedInput'
import { TextArea } from '../../UIkit/Form/Textarea'
import ImgIcon from './img/image-icon.svg'

const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

const Label = styled('label', {
  ...textVariant('primary1').true,
  marginBottom: '$3',
  color: '$blue900',
  display: 'block'
})

const TextBold = styled('span', {
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
  cursor: 'pointer',
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex'
  }
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

const FormControl = styled('div', {
  marginBottom: '$4'
})

const Form = styled('form', {
  maxWidth: '$breakpoints$sm',
  marginLeft: 'auto',
  marginRight: 'auto'
})

export default function CreateCollectionPage() {
  return (
    <PageLayout css={{ minHeight: '100vh', paddingBottom: '$4' }}>
      <Form>
        <Title>Create New Collection</Title>

        <Label>Upload a Logo</Label>

        <File htmlFor='inputTag'>
          <FileImageContainer>
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

        <FormControl>
          <Label>Name</Label>
          <Input placeholder='Collection name' />
        </FormControl>

        <FormControl>
          <Label>Symbol</Label>
          <Input placeholder='Token symbol' />
        </FormControl>

        <FormControl>
          <Label>
            Description&nbsp;&nbsp;<TextGray>(Optional)</TextGray>
          </Label>
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
