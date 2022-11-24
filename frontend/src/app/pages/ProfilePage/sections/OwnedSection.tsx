import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { getIHttpLinkFromIpfsString } from '../../CollectionPage/sections/NftSection'
import { CardsContainer } from '../../MarketPage/NftSection'

export const OwnedSection = observer(() => {
  const { profileId } = useParams<{ profileId: `0x${string}` }>()
  const { tokens, isLoaded, isLoading } =
    useCollectionAndTokenListStore(profileId)

  const [cards, setCards] = useState<NFTCardProps[]>([])

  useEffect(() => {
    const nfts = toJS(tokens)
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
  }, [isLoaded])

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5}/>
      ) : (
        cards.map((card, i) => <NFTCard {...card} key={i} />)
      )}
    </CardsContainer>
  )
})

export default OwnedSection
