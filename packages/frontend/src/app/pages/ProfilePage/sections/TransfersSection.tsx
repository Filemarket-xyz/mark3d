import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { TransferCard } from '../../../components/MarketCard/TransferCard'
import Plug from '../../../components/Plug/Plug'
import { useUserTransferStore } from '../../../hooks/useUserTransfers'
import { Button, CardsPlaceholder, Txt } from '../../../UIkit'
import { Params } from '../../../utils/router/Params'
import { CardsContainer } from '../../MarketPage/NftSection'

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
        <Plug header={'You don`t have any activity'}
              mainText={'Get started by creating your own NFT or go to the market to find something amazing'}
              buttonsBlock={<>
                <Button primary onClick={() => { navigate('/market') }}>
                  <Txt primary1>3D Market</Txt>
                </Button>
                <Button onClick={() => { navigate('/create') }}>
                  <Txt primary1>Create</Txt>
                </Button></>}
        />
      )}
    </>
  )
})

export default TransfersSection
