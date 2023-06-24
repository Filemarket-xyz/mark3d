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

// Ну это временное решение, ибо пока долго думать времени нету))

export const funcTimeout = (func: any) => {
  setTimeout(async () => {
    let countReload = 0
    let data = await func()
    const interval = setInterval(async () => {
      const tempData = await func()
      if (tempData !== data || countReload > 5) {
        clearInterval(interval)
      }
      countReload++
      data = await func()
    }, 5000)
  }, 2000)
}

export const NFTDealActions: FC<NFTDealActionsProps> = observer(({
  tokenFullId,
  transfer,
  order,
  reFetchOrder,
}) => {
  const { isOwner, error, refetch } = useIsOwner(tokenFullId)
  const { blockStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })

  if (error) {
    return <BaseModal {...modalProps} />
  }

  if (isOwner) {
    return (
      <ButtonsContainer content={blockStore.canContinue ? ''
        : `Confirmations: ${blockStore.currentBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}/${blockStore.receiptBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}`}
      >
        <NFTDealActionOwner
          transfer={transfer}
          tokenFullId={tokenFullId}
          ownerStatusChanged={() => {}}
          reFetchOrder={() => { }}
        />
      </ButtonsContainer>
    )
  }

  return (
    <ButtonsContainer content={blockStore.canContinue ? ''
      : `Confirmations: ${blockStore.currentBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}/${blockStore.receiptBlockNumber.sub(blockStore.lastCurrentBlockNumber).toString()}`}
    >
      <NFTDealActionsBuyer
        transfer={transfer}
        order={order}
        tokenFullId={tokenFullId}
        ownerStatusChanged={() => {}}
        reFetchOrder={ () => {} }
      />
    </ButtonsContainer>
  )
})
