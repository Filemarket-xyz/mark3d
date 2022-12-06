import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { TransferCard } from '../../../components/MarketCard/TransferCard'
import { gradientPlaceholderImg } from '../../../components/Placeholder/GradientPlaceholder'
import { Params } from '../../../utils/router/Params'
import { CardsContainer } from '../../MarketPage/NftSection'

function TransfersSection() {
  const { address: currentAddress } = useAccount()
  const { profileAddress } = useParams<Params>()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentAddress !== profileAddress) {
      navigate('/')
    }
  }, [])

  return (
    <CardsContainer>
      <TransferCard
        button={{ link: 'https://google.com', text: 'Go to page' }}
        collection='some collection'
        imageURL={gradientPlaceholderImg}
        status='Active'
        title='Ultra VR'
        user={{ img: gradientPlaceholderImg, username: 'Beb beb' }}
        price={555}
      />
    </CardsContainer>
  )
}

export default TransfersSection
