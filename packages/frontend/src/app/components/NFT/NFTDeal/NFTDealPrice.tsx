import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'
import { formatCurrency } from '../../../utils/web3/currency'

export interface NFTDealPriceProps {
  price: string // amount of wei
}

export const Price = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '64px',
  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #232528',
  borderRadius: '16px',
  padding: '8px 16px'
})

export const PriceTitle = styled('span', {
  ...textVariant('primary2').true,
  color: '$gray500'
})

export const PriceValue = styled('p', {
  fontSize: '24px',
  fontWeight: 600,
  color: '$gray800'
})

export const NFTDealPrice: FC<NFTDealPriceProps> = observer(({ price }) => {
  return (
    <Price>
      <PriceTitle>Price</PriceTitle>
      <PriceValue>{formatCurrency(price)}</PriceValue>
    </Price>
  )
})
