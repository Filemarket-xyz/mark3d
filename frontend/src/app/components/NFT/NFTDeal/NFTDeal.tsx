import Badge from '../../Badge/Badge'
import creator from '../../../pages/NFTPage/img/creatorImg.jpg'
import React, { FC } from 'react'
import { styled } from '../../../../styles'
import { observer } from 'mobx-react-lite'
import { Order, Transfer } from '../../../../swagger/Api'
import { NFTDealPrice } from './NFTDealPrice'
import { TokenFullId } from '../../../processing/types'
import { NFTDealActions } from './NFTDealActions/NFTDealActions'
import { useSyncAESFileKey } from '../../../processing/hooks/useSyncAESFileKey'

export interface NFTDealProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  reFetchOrder?: () => void // currently order is refreshed only when it's created and cancelled
}

const DealContainer = styled('div', {
  borderRadius: '$4',
  border: '2px solid transparent',
  background:
    'linear-gradient($gray100 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
  padding: '$3'
})

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
  gap: '$4'
})

export const NFTDeal: FC<NFTDealProps> = observer(({
  transfer,
  order,
  tokenFullId,
  reFetchOrder
}) => {
  useSyncAESFileKey(tokenFullId, transfer)
  return (
    <DealContainer>
      <DealContainerInfo>
        <Badge
          wrapperProps={{ css: { flexShrink: 0 } }}
          imgUrl={creator}
          content={{ title: 'Creator', value: 'Underkong' }}
        />
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
    </DealContainer>
  )
})
