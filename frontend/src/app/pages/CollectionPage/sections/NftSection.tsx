import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { styled } from '../../../../styles'
import { CardsPlaceholder } from '../../../components/CardsPlaceholder/CardsPlaceholder'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { useNfts } from '../CollectionPage'

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

const getIpfsCid = (ipfs: string) => {
  const pattern = /ipfs:\/\/([A-Za-z0-9/.-_]+)/
  return pattern.exec(ipfs)?.[1] ?? ''
}

export const getIHttpLinkFromIpfsString = (ipfs: string) => {
  const ipfsCid = getIpfsCid(ipfs)
  return `https://ipfs.io/ipfs/${ipfsCid}`
}

const NftSection = observer(() => {
  const { collectionAndNfts, isLoading, isLoaded } = useNfts()
  const [NFTs, setNFTs] = useState<NFTCardProps[]>([])

  useEffect(() => {
    if (!isLoaded) return
    const nfts = collectionAndNfts?.tokens ?? []
    const colllection = collectionAndNfts?.collection

    setNFTs(
      nfts.map((token) => ({
        collection: colllection?.name ?? '',
        imageURL: getIHttpLinkFromIpfsString(token.image ?? ''),
        price: 99,
        title: token.name ?? '',
        user: {
          img: 'https://www.whatsappimages.in/wp-content/uploads/2021/07/Top-HD-sad-quotes-for-whatsapp-status-in-hindi-Pics-Images-Download-Free.gif',
          username: 'some username'
        }
      }))
    )
  }, [isLoaded])

  return (
    <CardsContainer>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : (
        NFTs.map((card, index) => <NFTCard {...card} key={index} />)
      )}
    </CardsContainer>
  )
})

export default NftSection
