import React from 'react'
import { CardsContainer } from './NftSection'
import collectionImg from './img/cardImg.jpg'
import CollectionCard, { CollectionCardProps } from '../../components/MarketCard/CollectionCard'
import icon from './img/icon.jpg'

const card: CollectionCardProps = {
  imageUrl: collectionImg,
  description: `FileMarket NFT collection for
  3D Internet and virtual worlds`,
  iconURL: icon
}

const cards: CollectionCardProps[] = []
for (let i = 0; i < 30; i++) {
  cards.push(card)
}

export default function CollectionSection() {
  return (
    <CardsContainer>
      {cards.map((card, i) => (
        <CollectionCard {...card} key={i} />
      ))}
    </CardsContainer>
  )
}
