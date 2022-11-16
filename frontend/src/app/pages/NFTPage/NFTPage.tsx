import React from 'react'
import { styled } from '../../../styles'
import { Button, PageLayout, textVariant } from '../../UIkit'
import creator from './img/creatorImg.jpg'
import collection from './img/collection.jpg'
import Badge from '../../components/Badge/Badge'

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

const BadgesContainer = styled('div', {
  display: 'flex',
  gap: '$3',
  '@sm': {
    flexDirection: 'column-reverse',
    gap: '$2'
  }
})

const GridLayout = styled(PageLayout, {
  paddingTop: 48,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '$4',
  '@md': {
    gridTemplateRows: 'max-content',
    gap: '$4',
    gridTemplateColumns: '1fr'
  }
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
  marginBottom: '$3',
  gap: '$3',
  '@sm': {
    flexDirection: 'column'
  }
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
  fontWeight: 700,
  color: '$blue900',
  '@xl': {
    fontSize: '$h4'
  }
})

export default function NFTPage() {
  return (
    <>
      <NFTPreviewContainer></NFTPreviewContainer>
      <GridLayout>
        <GridBlock>
          <NftName>VR Glasses</NftName>
          <MintTime>Minted on Sep 9, 2022</MintTime>
          <BadgesContainer>
            <Badge
              imgUrl={creator}
              content={{ title: 'Creator', value: 'Underkong' }}
            />
            <Badge
              imgUrl={collection}
              content={{ title: 'Collection', value: 'VR Glasses by Mark3d' }}
            />
          </BadgesContainer>
        </GridBlock>
        <GridBlock>
          <BuyContainer>
            <BuyContainerInfo>
              <Badge
                wrapperProps={{ css: { flexShrink: 0 } }}
                imgUrl={creator}
                content={{ title: 'Creator', value: 'Underkong' }}
              />
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
      </GridLayout>
    </>
  )
}
