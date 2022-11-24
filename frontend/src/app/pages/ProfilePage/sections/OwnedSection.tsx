import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { getIHttpLinkFromIpfsString } from '../../CollectionPage/sections/NftSection'
import { CardsContainer } from '../../MarketPage/NftSection'

export const OwnedSection = observer(() => {
  const { address } = useAccount()
  const { tokens, isLoaded } = useCollectionAndTokenListStore(address)

  const [cards, setCards] = useState<NFTCardProps[]>([])

  useEffect(() => {
    const nfts = toJS(tokens)
    if (!isLoaded) return
    console.log(nfts)

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
  console.log(toJS(tokens))

  return (
    <CardsContainer>
      {cards.map((card, i) => (
        <NFTCard {...card} key={i} />
      ))}
    </CardsContainer>
  )
})

export default OwnedSection
