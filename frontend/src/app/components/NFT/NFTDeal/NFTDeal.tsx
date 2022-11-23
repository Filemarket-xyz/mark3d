import Badge from '../../Badge/Badge'
import creator from '../../../pages/NFTPage/img/creatorImg.jpg'
import { Button, textVariant } from '../../../UIkit'
import React from 'react'
import { styled } from '../../../../styles'

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

export const NFTDeal = () => {
  return (
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
  )
}
