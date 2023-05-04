import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import { Transfer } from '../../../../../swagger/Api'
import { useIsApprovedExchange } from '../../../../processing'
import { TokenFullId } from '../../../../processing/types'
import { Txt } from '../../../../UIkit'
import { stringifyError } from '../../../../utils/error'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonApproveExchange } from './ActionButtons/ButtonApproveExchange'
import { ButtonApproveTransfer } from './ActionButtons/ButtonApproveTransfer'
import { ButtonCancelOrder } from './ActionButtons/ButtonCancelOrder'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonInitTransfer } from './ActionButtons/ButtonInitTransfer'
import { ButtonPlaceOrder } from './ActionButtons/ButtonPlaceOrder'
import { HideAction } from './HideAction'

export interface NFTDealActionsOwnerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  reFetchOrder?: () => void // caveat, there are no contract events on order placement
  ownerStatusChanged?: () => void
}

const permissions = transferPermissions.owner

export const NFTDealActionOwner: FC<NFTDealActionsOwnerProps> = observer(({
  transfer,
  tokenFullId,
  reFetchOrder,
  ownerStatusChanged
}) => {
  const { isApprovedExchange, error: isApprovedExchangeError, refetch } = useIsApprovedExchange(tokenFullId)
  const error = isApprovedExchangeError
  if (error) {
    return (
      <Txt color="red">
        {stringifyError(error)}
      </Txt>
    )
  }
  return (
    <>
      <HideAction hide={!transfer || !permissions.canApprove(transfer)}>
        <ButtonApproveTransfer tokenFullId={tokenFullId} transfer={transfer} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer tokenFullId={tokenFullId} callback={ownerStatusChanged} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancelOrder(transfer)}>
        <ButtonCancelOrder tokenFullId={tokenFullId} callback={reFetchOrder} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer tokenFullId={tokenFullId} />
      </HideAction>
      <HideAction hide={!!transfer}>
        <ButtonInitTransfer tokenFullId={tokenFullId} />
      </HideAction>
      <HideAction hide={!!transfer || !isApprovedExchange}>
        <ButtonPlaceOrder tokenFullId={tokenFullId} callback={reFetchOrder} />
      </HideAction>
      <HideAction hide={!!transfer || isApprovedExchange}>
        <ButtonApproveExchange
          tokenFullId={tokenFullId}
          callback={refetch}
        />
      </HideAction>
    </>
  )
})
