import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { styled } from '../../../../styles'
import NFTCard, { NFTCardProps } from '../../../components/MarketCard/NFTCard'
import { useCollectionTokenListStore } from '../../../hooks/useCollectionTokenListStore'

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
  const { collectionId } = useParams<{ collectionId: string }>()
  const { data, isLoaded } = useCollectionTokenListStore(collectionId)
  const [NFTs, setNFTs] = useState<NFTCardProps[]>([])

  useEffect(() => {
    if (!isLoaded) return

    setNFTs(
      toJS(data).map((token) => ({
        collection: 'some collection',
        imageURL: getIHttpLinkFromIpfsString(token.image ?? ''),
        price: 99,
        title: token.name ?? '',
        user: {
          img: 'https://www.whatsappimages.in/wp-content/uploads/2021/07/Top-HD-sad-quotes-for-whatsapp-status-in-hindi-Pics-Images-Download-Free.gif',
          username: 'some username'
        }
      }))
    )

    console.log(toJS(data), isLoaded)
  }, [isLoaded])

  return (
    <CardsContainer>
      {NFTs.map((card, index) => (
        <NFTCard {...card} key={index} />
      ))}
    </CardsContainer>
  )
})

export default NftSection
