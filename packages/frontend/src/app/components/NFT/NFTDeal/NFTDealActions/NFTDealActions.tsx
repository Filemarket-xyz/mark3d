import { observer } from 'mobx-react-lite'
import { Order, Transfer } from '../../../../../swagger/Api'
import { FC } from 'react'
import { TokenFullId } from '../../../../processing/types'
import { NFTDealActionOwner } from './NFTDealActionsOwner'
import { NFTDealActionsBuyer } from './NFTDealActionsBuyer'
import { Txt } from '../../../../UIkit'
import { stringifyError } from '../../../../utils/error'
import { useIsOwner } from '../../../../processing/hooks'

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
  reFetchOrder
}) => {
  const { isOwner, error, refetch } = useIsOwner(tokenFullId)
  if (error) {
    return <Txt color="red">{stringifyError(error)}</Txt>
  }
  if (isOwner) {
    return (
      <NFTDealActionOwner
        transfer={transfer}
        tokenFullId={tokenFullId}
        ownerStatusChanged={refetch}
        reFetchOrder={reFetchOrder}
      />
    )
  } else {
    return (
      <NFTDealActionsBuyer
        transfer={transfer}
        order={order}
        tokenFullId={tokenFullId}
        ownerStatusChanged={refetch}
        reFetchOrder={reFetchOrder}
      />
    )
  }
})
