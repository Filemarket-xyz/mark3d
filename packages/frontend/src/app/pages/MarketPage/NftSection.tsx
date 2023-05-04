import { observer } from 'mobx-react-lite'
import React from 'react'

import { styled } from '../../../styles'
import NFTCard from '../../components/MarketCard/NFTCard'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'

export const CardsContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '$4',
  justifyContent: 'normal',
  '@md': {
    justifyContent: 'space-around'
  },
  '@sm': {
    justifyContent: 'center'
  },
  paddingBottom: '$3'
})

const NftSection = observer(() => {
  const { nftCards } = useOpenOrderListStore()

  return (
    <CardsContainer>
      {nftCards.map((card, index) => (
        <NFTCard {...card} key={index} />
      ))}
    </CardsContainer>
  )
})

export default NftSection
