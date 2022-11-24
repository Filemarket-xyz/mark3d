import { Skeleton } from '@mui/material'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { useCollectionAndTokenListStore } from '../../../hooks'
import { getIHttpLinkFromIpfsString } from '../../CollectionPage/sections/NftSection'
import { CardsContainer } from '../../MarketPage/NftSection'

const CardsPlaceholder = () => (
  <>
    {new Array<number>(5).fill(0).map((_, i) => (
      <Skeleton
        sx={{ borderRadius: '16px' }}
        variant='rectangular'
        width={259}
        height={324}
        key={i}
      />
    ))}
  </>
)

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
        <CardsPlaceholder />
      ) : (
        cards.map((card, i) => <NFTCard {...card} key={i} />)
      )}
    </CardsContainer>
  )
})

export default OwnedSection
