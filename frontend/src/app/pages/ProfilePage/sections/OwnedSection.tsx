import React, { useEffect, useState } from 'react'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { getIHttpLinkFromIpfsString } from '../../CollectionPage/sections/NftSection'
import { CardsContainer } from '../../MarketPage/NftSection'
import { useNfts } from '../ProfilePage'

/** Reduce address to view like **0x1234...5678** */
export const reduceAddress = (profileAddress: string) => {
  return `${profileAddress.slice(0, 6)}...${profileAddress.slice(-4)}`
}

export const OwnedSection = () => {
  const { isLoaded, isLoading, nfts } = useNfts()

  const [cards, setCards] = useState<NFTCardProps[]>([])

  useEffect(() => {
    if (!isLoaded) return

    setCards(
      nfts.map((nft) => ({
        collection: reduceAddress(nft.collection ?? ''),
        imageURL: getIHttpLinkFromIpfsString(nft.image ?? ''),
        price: 999,
        title: nft.name ?? '',
        user: {
          img: '',
          username: reduceAddress(nft.owner ?? '')
        }
      }))
    )
  }, [nfts])

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : (
        cards.map((card, i) => <NFTCard {...card} key={i} />)
      )}
    </CardsContainer>
  )
}

export default OwnedSection
