import React from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant } from '../../UIkit'
import creator from './img/creatorImg.jpg'
import collection from './img/collection.jpg'

const NFTPreviewContainer = styled('div', {
  paddingTop: '$layout$navbarheight',
  width: '100%',
  // TODO height will be set by 3d previewer
  height: 800,
  background: '$gray300'
})

const NftName = styled('h1', {
  ...textVariant('h3').true,
  color: '$blue900',
  marginBottom: '$1'
})

const MintTime = styled('p', {
  ...textVariant('primary1').true,
  color: '$gray500'
})

const NftTagsContainer = styled('div', {
  display: 'flex',
  gap: '$3'
})

const NftTag = styled('div', {
  backgroundColor: '$white',
  display: 'flex',
  gap: '$2',
  padding: '$2 $3',
  alignItems: 'center',
  borderRadius: '$3'
})

const NftTagTitle = styled('p', {
  color: '$gray500',
  ...textVariant('primary3').true
})

const NftTagValue = styled('p', {
  ...textVariant('primary1').true,
  color: '$blue500'
})

const NftTagInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1'
})

const NftTagImage = styled('img', {
  width: 48,
  height: 48,
  borderRadius: '50%',
  border: '2px solid $blue500'
})

export default function NFTPage() {
  return (
    <>
      <NFTPreviewContainer></NFTPreviewContainer>
      <PageLayout>
        <NftName>VR Glasses</NftName>
        <MintTime>Minted on Sep 9, 2022</MintTime>
        <NftTagsContainer>
          <NftTag>
            <NftTagImage src={creator} />
            <NftTagInfo>
              <NftTagTitle>Creator</NftTagTitle>
              <NftTagValue>Underkong</NftTagValue>
            </NftTagInfo>
          </NftTag>
          <NftTag>
            <NftTagImage src={collection} />
            <NftTagInfo>
              <NftTagTitle>Collection</NftTagTitle>
              <NftTagValue>VR Glasses by Mark3d</NftTagValue>
            </NftTagInfo>
          </NftTag>
        </NftTagsContainer>
      </PageLayout>
    </>
  )
}
