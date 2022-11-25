import React, { useEffect, useState } from 'react'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { getHttpLinkFromIpfsString } from '../../../utils/nfts/getHttpLinkFromIpfsString'
import { reduceAddress } from '../../../utils/nfts/reduceAddress'
import { CardsContainer } from '../../MarketPage/NftSection'
import { useNfts } from '../ProfilePage'

export const OwnedSection = () => {
  const { isLoaded, isLoading, nfts } = useNfts()

  const [cards, setCards] = useState<NFTCardProps[]>([])

  useEffect(() => {
    if (!isLoaded) return

    setCards(
      nfts.map((nft) => ({
        collection: reduceAddress(nft.collection ?? ''),
        imageURL: getHttpLinkFromIpfsString(nft.image ?? ''),
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
