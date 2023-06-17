import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { Transfer } from '../../../../../swagger/Api'
import { useStatusModal } from '../../../../hooks/useStatusModal'
import { useIsApprovedExchange } from '../../../../processing'
import { TokenFullId } from '../../../../processing/types'
import { Button } from '../../../../UIkit'
import { transferPermissions } from '../../../../utils/transfer/status'
import BaseModal from '../../../Modal/Modal'
import { ButtonApproveExchange } from './ActionButtons/ButtonApproveExchange'
import { ButtonApproveTransfer } from './ActionButtons/ButtonApproveTransfer'
import { ButtonCancelOrder } from './ActionButtons/ButtonCancelOrder'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonInitTransfer } from './ActionButtons/ButtonInitTransfer'
import { ButtonPlaceOrder } from './ActionButtons/ButtonPlaceOrder'
import { HideAction } from './HideAction'
import { funcTimeout } from './NFTDealActions'

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
  ownerStatusChanged,
}) => {
  const { isApprovedExchange, error: isApprovedExchangeError, refetch } = useIsApprovedExchange(tokenFullId)
  const error = isApprovedExchangeError

  const { modalProps } = useStatusModal({
    statuses: { result: undefined, isLoading: false, error: error as unknown as string },
    okMsg: '',
    loadingMsg: '',
  })

  if (error) {
    return <BaseModal {...modalProps} />
  }

  return (
    <>
      <HideAction hide={!transfer || !permissions.canWaitBuyer(transfer)}>
        <Button
          primary
          fullWidth
          borderRadiusSecond
          isDisabled
        >
          Waiting for buyer
        </Button>
      </HideAction>
      <HideAction hide={!transfer || !permissions.canApprove(transfer)}>
        <ButtonApproveTransfer tokenFullId={tokenFullId} transfer={transfer} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer tokenFullId={tokenFullId} callBack={ownerStatusChanged} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancelOrder(transfer)}>
        <ButtonCancelOrder tokenFullId={tokenFullId} callBack={reFetchOrder} />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer tokenFullId={tokenFullId} callBack={() => { funcTimeout(refetch); reFetchOrder?.() }} />
      </HideAction>
      <HideAction hide={!!transfer || !isApprovedExchange}>
        <ButtonPlaceOrder tokenFullId={tokenFullId} callBack={reFetchOrder} />
      </HideAction>
      <HideAction hide={!!transfer || isApprovedExchange}>
        <ButtonApproveExchange
          tokenFullId={tokenFullId}
          callBack={refetch}
        />
      </HideAction>
      <HideAction hide={!!transfer}>
        <ButtonInitTransfer tokenFullId={tokenFullId} />
      </HideAction>
    </>
  )
})
