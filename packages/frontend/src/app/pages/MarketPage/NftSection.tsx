import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../styles'
import { NFTCard } from '../../components'
import Plug from '../../components/Plug/Plug'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { Button, Txt } from '../../UIkit'

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
  const navigate = useNavigate()

  return (
    <CardsContainer>
      {nftCards.map((card, index) => (
        <NFTCard {...card} key={index} />
      ))}
      {nftCards.length <= 0 && (
        <Plug
          header={'There\'s not one thing'}
          mainText={'Be the first and create your first EFT'}
          buttonsBlock={(
            <Button primary onClick={() => navigate('/create')}>
              <Txt primary1>Create</Txt>
            </Button>
          )}
        />
      )}
    </CardsContainer>
  )
})

export default NftSection
