import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { Transfer } from '../../../../../swagger/Api'
import { useStores } from '../../../../hooks'
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

export interface NFTDealActionsOwnerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  callBack?: () => void
  onError?: () => void
}

const permissions = transferPermissions.owner

export const NFTDealActionOwner: FC<NFTDealActionsOwnerProps> = observer(({
  transfer,
  tokenFullId,
  callBack,
  onError,
}) => {
  const { isApprovedExchange, error: isApprovedExchangeError, refetch } = useIsApprovedExchange(tokenFullId)
  const error = isApprovedExchangeError

  // useWatchCollectionEvents({
  //   onApproval: () => { refetch(); transferStore.setIsLoading(false) },
  // }, collectionAddress)
  const { blockStore, transferStore } = useStores()
  const refetchFunc = () => {
    setTimeout(async () => {
      let countReload = 0
      let data = await refetch()
      const interval = setInterval(async () => {
        const tempData = await refetch()
        if (data.data !== tempData.data || countReload > 8) {
          clearInterval(interval)
          transferStore.setIsLoadingTransition(false)
        }
        countReload++
        data = await refetch()
      }, 2000)
    }, 6000)
  }

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
        <ButtonApproveTransfer
          tokenFullId={tokenFullId}
          callBack={callBack}
          transfer={transfer}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer
          tokenFullId={tokenFullId}
          callBack={callBack}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancelOrder(transfer)}>
        <ButtonCancelOrder
          tokenFullId={tokenFullId}
          callBack={callBack}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
      <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer
          tokenFullId={tokenFullId}
          callBack={callBack}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
      <HideAction hide={!!transfer || !isApprovedExchange}>
        <ButtonPlaceOrder
          tokenFullId={tokenFullId}
          callBack={callBack}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
      <HideAction hide={!!transfer || isApprovedExchange}>
        <ButtonApproveExchange
          tokenFullId={tokenFullId}
          isDisabled={!blockStore.canContinue}
          onError={onError}
          callBack={ () => { callBack?.(); refetchFunc() }}
        />
      </HideAction>
      <HideAction hide={!!transfer}>
        <ButtonInitTransfer
          tokenFullId={tokenFullId}
          callBack={callBack}
          isDisabled={!blockStore.canContinue}
          onError={onError}
        />
      </HideAction>
    </>
  )
})
