import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { Order, Transfer } from '../../../../../swagger/Api'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { useIsOwner } from '../../../../processing'
import { TokenFullId } from '../../../../processing/types'
import MintModal from '../../../Modal/Modal'
import { NFTDealActionsBuyer } from './NFTDealActionsBuyer'
import { NFTDealActionOwner } from './NFTDealActionsOwner'

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
    }, 1000)
  }, 2000)
}

export const NFTDealActions: FC<NFTDealActionsProps> = observer(({
  tokenFullId,
  transfer,
  order,
  reFetchOrder,
}) => {
  const { isOwner, error, refetch } = useIsOwner(tokenFullId)

  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })

  if (error) {
    return <MintModal {...modalProps} />
  }

  if (isOwner) {
    return (
      <NFTDealActionOwner
        transfer={transfer}
        tokenFullId={tokenFullId}
        ownerStatusChanged={() => { funcTimeout(refetch) }}
        reFetchOrder={() => { funcTimeout(reFetchOrder) }}
      />
    )
  }

  return (
    <NFTDealActionsBuyer
      transfer={transfer}
      order={order}
      tokenFullId={tokenFullId}
      ownerStatusChanged={refetch}
      reFetchOrder={reFetchOrder}
    />
  )
})
