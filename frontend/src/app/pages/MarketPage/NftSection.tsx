import React from 'react'
import { styled } from '../../../styles'
import NFTCard, { NFTCardProps } from '../../components/MarketCard/NFTCard'
import nftImg from './img/cardImg.jpg'
import userImg from './img/userImg.jpg'

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

const card: NFTCardProps = {
  collection: 'VR Glasses collection',
  imageURL: nftImg,
  price: 0.77777,
  title: 'Ultra mega super VR Glasses 6353526 asjsdjsj',
  user: {
    img: userImg,
    username: 'UnderKong'
  }
}
const cards: NFTCardProps[] = []
for (let i = 0; i < 30; i++) {
  cards.push(card)
}

export default function NftSection() {
  return (
    <CardsContainer>
      {cards.map((card, index) => (
        <NFTCard {...card} key={index} />
      ))}
    </CardsContainer>
  )
}
