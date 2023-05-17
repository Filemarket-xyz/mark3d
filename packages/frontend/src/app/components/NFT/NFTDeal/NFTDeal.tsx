import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren } from 'react'

import { styled } from '../../../../styles'
import { Order, Transfer } from '../../../../swagger/Api'
import { TokenFullId } from '../../../processing/types'
import { NFTDealActions } from './NFTDealActions/NFTDealActions'
import { NFTDealPrice } from './NFTDealPrice'

export type NFTDealProps = PropsWithChildren<{
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  reFetchOrder?: () => void // currently order is refreshed only when it's created and cancelled
}>

const NFTDealStyle = styled('div', {
  width: '400px',
  height: '160px',
  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), #232528',
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '@md': {
    width: '100%',
    height: '201px'
  }
})

const DealContainerInfo = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3',
  gap: '$3',
  padding: '0 16px',
  '@sm': {
    flexDirection: 'column'
  }
})

const ButtonsContainer = styled('div', {
  display: 'flex',
  justifyContent: 'stretch',
  gap: '$3',
  width: '100%',
  flexDirection: 'column',
  padding: '0 16px',
  '@sm': {
    flexDirection: 'column',
    gap: '$3'
  }
})

export const NFTDeal: FC<NFTDealProps> = observer(({
  transfer,
  order,
  tokenFullId,
  reFetchOrder,
  children
}) => {
  return (
    <NFTDealStyle>
      {(children || order) && (
        <DealContainerInfo>
          {children}
          {order && (
            <NFTDealPrice price={order.price ?? '0'} />
          )}
        </DealContainerInfo>
      )}
      <ButtonsContainer>
        <NFTDealActions
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          reFetchOrder={reFetchOrder}
        />
      </ButtonsContainer>
    </NFTDealStyle>
  )
})
