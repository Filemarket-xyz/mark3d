import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { TransferCard } from '../../../components/MarketCard/TransferCard'
import { useUserTransferStore } from '../../../hooks/useUserTransfers'
import { CardsPlaceholder } from '../../../UIkit'
import { Params } from '../../../utils/router/Params'
import { CardsContainer } from '../../MarketPage/NftSection'
import { EmptyTablePlaceholder } from './HistorySection'

const TransfersSection = observer(() => {
  const { address: currentAddress } = useAccount()
  const { profileAddress } = useParams<Params>()

  const navigate = useNavigate()

  useEffect(() => {
    if (currentAddress !== profileAddress) {
      navigate('/')
    }
  }, [])

  const { transferCards, isLoading } = useUserTransferStore(profileAddress)

  return (
    <>
      {isLoading ? (
        <CardsPlaceholder cardsAmount={5} />
      ) : transferCards.length ? (
        <CardsContainer>
          {transferCards.map((card, i) => (
            <TransferCard {...card} key={i} />
          ))}
        </CardsContainer>
      ) : (
        <EmptyTablePlaceholder>No active transfers</EmptyTablePlaceholder>
      )}
    </>
  )
})

export default TransfersSection
