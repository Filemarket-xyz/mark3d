import { styled } from '../../../styles'
import ImageLoader from '../../components/Uploaders/ImageLoader/ImageLoader'
import { Button, PageLayout, textVariant } from '../../UIkit'
import { Input } from '../../UIkit/Form/Input'
import PrefixedInput from '../../UIkit/Form/PrefixedInput'
import { TextArea } from '../../UIkit/Form/Textarea'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { MintNFTForm, useMintNFT } from '../../processing/hooks/useMintNFT'

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

const CreateCollectionPage = observer(() => {
  const [file, setFile] = useState<File>()
  console.log('file', file)
  const form: MintNFTForm = {
    name: 'I am super NFT',
    description: 'abracadabra',
    collectionAddress: '0xE37382F84dC2C72EF7eAaC6e327BBA054b30628C',
    image: file,
    hiddenFile: file
  }
  const { mintNFT, ...statuses } = useMintNFT(form)
  return (
    <PageLayout
      css={{
        minHeight: '100vh',
        paddingBottom: '$4'
      }}
    >
      <Form>
        <Title>Create New Collection</Title>

        <FormControl>
          <Label css={{ marginBottom: '$3' }}>Upload a Logo</Label>
          <ImageLoader onChange={setFile} />
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
        <div>
          {JSON.stringify(statuses)}
        </div>
        <Button type='submit' primary onPress={ () => void mintNFT() }>
          Mint
        </Button>
      </Form>
    </PageLayout>
  )
})

export default CreateCollectionPage
