import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'
import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'

export interface NFTDealPriceProps {
  price: string // amount of wei
}

export const Price = styled('div', {
  display: 'flex',
  gap: '$1',
  flexDirection: 'column'
})

export const PriceTitle = styled('span', {
  ...textVariant('primary1'),
  color: '$gray500'
})

export const PriceValue = styled('p', {
  fontSize: '$h3',
  fontWeight: 700,
  color: '$blue900',
  '@xl': {
    fontSize: '$h4'
  }
})

export const NFTDealPrice: FC<NFTDealPriceProps> = observer(({ price }) => {
  return (
    <Price>
      <PriceTitle>Price</PriceTitle>
      <PriceValue>0.123456 ETH</PriceValue>
    </Price>
  )
})
