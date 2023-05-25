import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { TransferCard } from '../../../components/MarketCard/TransferCard'
import Plug from '../../../components/Plug/Plug'
import { useUserTransferStore } from '../../../hooks/useUserTransfers'
import { Button, InfiniteScroll, Txt } from '../../../UIkit'
import { Params } from '../../../utils/router/Params'

const TransfersSection: React.FC = observer(() => {
  const { address: currentAddress } = useAccount()
  const { profileAddress } = useParams<Params>()
  const userTransferStore = useUserTransferStore(profileAddress)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentAddress !== profileAddress) {
      navigate('/')
    }
  }, [])

  return (
    <>
      <InfiniteScroll
      // TODO: update
        hasMore={false}
        fetchMore={() => userTransferStore.requestMore()}
        isLoading={userTransferStore.isLoading}
        currentItemCount={userTransferStore.transferCards.length}
        render={({ index }) => <TransferCard {...userTransferStore.transferCards[index]} key={index} />}
        listCss={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '$4',
          '@md': {
            justifyContent: 'space-around'
          },
          '@sm': {
            justifyContent: 'center'
          },
          paddingBottom: '$3'
        }}
      />
      {!userTransferStore.transferCards.length && !userTransferStore.isLoading && (
        <Plug
          header={'You don`t have any activity'}
          mainText={'Get started by creating your own NFT or go to the market to find something amazing'}
          buttonsBlock={(
            <>
              <Button primary onClick={() => navigate('/market') }>
                <Txt primary1>3D Market</Txt>
              </Button>
              <Button onClick={() => navigate('/create') }>
                <Txt primary1>Create</Txt>
              </Button>
            </>
          )}
        />
      )}
    </>
  )
})

export default TransfersSection
