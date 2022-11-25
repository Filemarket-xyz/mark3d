import React, { useEffect, useState } from 'react'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { getIHttpLinkFromIpfsString } from '../../CollectionPage/sections/NftSection'
import { CardsContainer } from '../../MarketPage/NftSection'
import { useNfts } from '../ProfilePage'

export const OwnedSection = () => {
  const { isLoaded, isLoading, nfts } = useNfts()
  console.log(nfts)

  const [cards, setCards] = useState<NFTCardProps[]>([])

  useEffect(() => {
    if (!isLoaded) return

    setCards(
      nfts.map((nft) => ({
        collection: nft.collection ?? '',
        imageURL: getIHttpLinkFromIpfsString(nft.image ?? ''),
        price: 999,
        title: nft.name ?? '',
        user: {
          img: '',
          username: nft.creator ?? ''
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
