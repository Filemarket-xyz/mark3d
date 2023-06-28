import { Tooltip } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { Order, Transfer } from '../../../../../swagger/Api'
import { useStores } from '../../../../hooks'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { useIsOwner } from '../../../../processing'
import { TokenFullId } from '../../../../processing/types'
import BaseModal from '../../../Modal/Modal'
import { NFTDealActionsBuyer } from './NFTDealActionsBuyer'
import { NFTDealActionOwner } from './NFTDealActionsOwner'

const ButtonsContainer = styled(Tooltip, {
  display: 'flex',
  justifyContent: 'stretch',
  gap: '$3',
  width: '100%',
  flexDirection: 'column',
  padding: '0 16px',
  '@sm': {
    flexDirection: 'column',
    gap: '$3',
  },
})

export interface NFTDealActionsProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  reFetchOrder?: () => void
}

export const NFTDealActions: FC<NFTDealActionsProps> = observer(({
  tokenFullId,
  transfer,
  order,
}) => {
  const { isOwner, error } = useIsOwner(tokenFullId)
  const { blockStore, transferStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })

  const onActionStart = () => {
    // we disable buttons when user starts contract interaction, and enable back when event arrives
    transferStore.setIsWaitingForEvent(true)
  }

  const onActionError = () => {
    transferStore.setIsWaitingForEvent(false)
  }

  if (error) {
    return <BaseModal {...modalProps} />
  }

  const isDisabled = !blockStore.canContinue || transferStore.isWaitingForEvent

  return (
    <ButtonsContainer content={blockStore.canContinue ? ''
      : `Confirmations: ${blockStore.currentBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}/${blockStore.receiptBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}`}
    >
      {isOwner ? (
        <NFTDealActionOwner
          transfer={transfer}
          tokenFullId={tokenFullId}
          onStart={onActionStart}
          onError={onActionError}
          isDisabled={isDisabled}
        />
      ) : (
        <NFTDealActionsBuyer
          transfer={transfer}
          order={order}
          tokenFullId={tokenFullId}
          onStart={onActionStart}
          onError={onActionError}
          isDisabled={isDisabled}
        />
      )}
    </ButtonsContainer>
  )
})
