import { observer } from 'mobx-react-lite'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../styles'
import { NFTCard } from '../../components'
import Plug from '../../components/Plug/Plug'
import { useOpenOrderListStore } from '../../hooks/useOrdersListStore'
import { Button, InfiniteScroll, nftCardListCss, Txt } from '../../UIkit'

export const CardsContainer = styled('div', {
  justifyContent: 'normal',
  ...nftCardListCss,
})

const NftSection: React.FC = observer(() => {
  const openOrderListStore = useOpenOrderListStore()
  const navigate = useNavigate()

  return (
    <>
      <InfiniteScroll
        hasMore={!!openOrderListStore.data.total}
        isLoading={openOrderListStore.isLoading}
        currentItemCount={openOrderListStore.nftCards.length}
        fetchMore={() => openOrderListStore.requestMore()}
        render={({ index }) => <NFTCard {...openOrderListStore.nftCards[index]} key={index} />}
        listCss={nftCardListCss}
      />
      {!openOrderListStore.nftCards.length && !openOrderListStore.isLoading && (
        <Plug
          header={'There\'s not one thing'}
          mainText={'Be the first and create your first EFT'}
          buttonsBlock={(
            <Button primary onClick={() => navigate('/create')}>
              <Txt primary1>Create</Txt>
            </Button>
          )}
        />
      )}
    </>
  )
})

export default NftSection
