import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import { Order, Transfer } from '../../../../../swagger/Api'
import { useStores } from '../../../../hooks'
import { useIsBuyer } from '../../../../processing'
import { TokenFullId } from '../../../../processing/types'
import { Button } from '../../../../UIkit'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonFulfillOrder } from './ActionButtons/ButtonFulfillOrder'
import { ButtonReportFraudTransfer } from './ActionButtons/ButtonReportFraudTransfer'
import { ButtonSetPublicKeyTransfer } from './ActionButtons/ButtonSetPublicKeyTransfer'
import { HideAction } from './HideAction'

export interface NFTDealActionsBuyerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  order?: Order
  ownerStatusChanged?: () => void
  reFetchOrder?: () => void
}

const permissions = transferPermissions.buyer

export const NFTDealActionsBuyer: FC<NFTDealActionsBuyerProps> = observer(({
  transfer,
  order,
  tokenFullId,
  ownerStatusChanged,
  reFetchOrder,
}) => {
  const isBuyer = useIsBuyer(transfer)
  const { blockStore } = useStores()

  return (
    <>
      <HideAction hide={!isBuyer || !transfer || !permissions.canWaitSeller(transfer)}>
        <Button
          primary
          fullWidth
          borderRadiusSecond
          isDisabled
        >
          Waiting for seller
        </Button>
      </HideAction>
      <HideAction hide={!transfer || !permissions.canFulfillOrder(transfer)}>
        <ButtonFulfillOrder tokenFullId={tokenFullId} order={order} isDisabled={!blockStore.canContinue} />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canSetPublicKey(transfer)}>
        <ButtonSetPublicKeyTransfer tokenFullId={tokenFullId} isDisabled={!blockStore.canContinue} />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canFinalize(transfer)}>
        <ButtonFinalizeTransfer
          tokenFullId={tokenFullId}
          callBack={() => {
            ownerStatusChanged?.()
            reFetchOrder?.()
          }}
          isDisabled={!blockStore.canContinue}
        />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canReportFraud(transfer)}>
        <ButtonReportFraudTransfer tokenFullId={tokenFullId} isDisabled={!blockStore.canContinue} />
      </HideAction>
      <HideAction hide={!isBuyer || !transfer || !permissions.canCancel(transfer)}>
        <ButtonCancelTransfer tokenFullId={tokenFullId} callBack={reFetchOrder} isDisabled={!blockStore.canContinue} />
      </HideAction>
    </>
  )
})
