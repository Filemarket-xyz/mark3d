import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
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
  color: '$gray500',
  marginBottom: '$3'
})

const NftTagsContainer = styled('div', {
  display: 'flex',
  gap: '$3'
})

// TODO make separate component
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

const Layout = styled(PageLayout, {
  paddingTop: 48,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '$4'
})

const GridBlock = styled('div')

const BuyContainer = styled('div', {
  borderRadius: '$4',
  border: '2px solid transparent',
  background:
    'linear-gradient($gray100 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
  padding: '$3'
})

const BuyContainerInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3'
})

const Price = styled('div', {
  display: 'flex',
  gap: '$1',
  flexDirection: 'column'
})

const PriceTitle = styled('span', {
  ...textVariant('primary1'),
  color: '$gray500'
})

const PriceValue = styled('p', {
  fontSize: '$h3',
  fontWeight: 700
})

export default function NFTPage() {
  return (
    <>
      <NFTPreviewContainer></NFTPreviewContainer>
      <Layout>
        <GridBlock>
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
        </GridBlock>
        <GridBlock>
          <BuyContainer>
            <BuyContainerInfo>
              <NftTag css={{ width: 'max-content' }}>
                <NftTagImage src={creator} />
                <NftTagInfo>
                  <NftTagTitle>Creator</NftTagTitle>
                  <NftTagValue>Underkong</NftTagValue>
                </NftTagInfo>
              </NftTag>

              <Price>
                <PriceTitle>Price</PriceTitle>
                <PriceValue>0.123456 ETH</PriceValue>
              </Price>
            </BuyContainerInfo>
            <Button primary css={{ width: '100%' }}>
              Buy now
            </Button>
          </BuyContainer>
        </GridBlock>
      </Layout>
    </>
  )
}
