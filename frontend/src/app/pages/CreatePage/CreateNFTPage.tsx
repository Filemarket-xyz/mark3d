import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../../../styles'
import NftLoader from '../../components/Uploaders/NftLoader/NftLoader'
import { Button, PageLayout } from '../../UIkit'
import Combobox from '../../UIkit/Form/Combobox'
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
import PlusIcon from './img/plus-icon.svg'

const Description = styled('p', {
  fontSize: '12px',
  color: '$gray500',
  marginBottom: '$2'
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
      width: 'calc(100% - 2 * calc((100% - $breakpoints$md) * 0.5 + $space$3))'
    },
    '@md': {
      width: 'calc(100% - 2 * calc((100% - $breakpoints$sm) * 0.5 + $space$2))'
    },
    '@sm': {
      width: 'calc(100% - 2 * $space$2)'
    }
  }
})

export default function CreateNftPage() {
  return (
    <PageLayout css={{ paddingBottom: '$4' }}>
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
          <NftLoader />
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
          <CollectionPickerContainer>
            <Combobox
              options={[
                { title: 'first collection' },
                { title: 'second collection' }
              ]}
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
