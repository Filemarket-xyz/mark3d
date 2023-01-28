import React, { FC, PropsWithChildren } from 'react'
import { styled } from '../../../../styles'
import { observer } from 'mobx-react-lite'
import { Order, Transfer } from '../../../../swagger/Api'
import { NFTDealPrice } from './NFTDealPrice'
import { TokenFullId } from '../../../processing/types'
import { NFTDealActions } from './NFTDealActions/NFTDealActions'
import { useSyncAESFileKey } from '../../../processing/hooks/useSyncAESFileKey'

export type NFTDealProps = PropsWithChildren<{
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  reFetchOrder?: () => void // currently order is refreshed only when it's created and cancelled
}>

const DealContainerInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3',
  gap: '$3',
  '@sm': {
    flexDirection: 'column'
  }
})

const ButtonsContainer = styled('div', {
  display: 'flex',
  justifyContent: 'stretch',
  gap: '$4',
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
  useSyncAESFileKey(tokenFullId, transfer)
  return (
    <>
      <DealContainerInfo>
        {children}
        {order && (
          <NFTDealPrice price={order.price ?? '0'}/>
        )}
      </DealContainerInfo>
      <ButtonsContainer>
        <NFTDealActions
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          reFetchOrder={reFetchOrder}
        />
      </ButtonsContainer>
    </>
  )
})
