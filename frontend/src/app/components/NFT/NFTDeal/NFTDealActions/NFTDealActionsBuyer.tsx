import { observer } from 'mobx-react-lite'
import { Order, Transfer } from '../../../../../swagger/Api'
import { TokenFullId } from '../../../../processing/types'
import { FC } from 'react'
import { transferPermissions } from '../../../../utils/transfer/status'
import { ButtonFulfillOrder } from './ActionButtons/ButtonFulfillOrder'
import { ButtonSetPublicKeyTransfer } from './ActionButtons/ButtonSetPublicKeyTransfer'
import { ButtonFinalizeTransfer } from './ActionButtons/ButtonFinalizeTransfer'
import { ButtonReportFraudTransfer } from './ActionButtons/ButtonReportFraudTransfer'
import { ButtonCancelTransfer } from './ActionButtons/ButtonCancelTransfer'
import { Button } from '../../../../UIkit'
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
  reFetchOrder
}) => {
  return (
      <>
        <HideAction hide={!transfer || !permissions.canFulfillOrder(transfer)}>
          <ButtonFulfillOrder tokenFullId={tokenFullId} order={order}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canSetPublicKey(transfer)}>
          <ButtonSetPublicKeyTransfer tokenFullId={tokenFullId}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
          <ButtonFinalizeTransfer tokenFullId={tokenFullId} callback={() => {
            ownerStatusChanged?.()
            reFetchOrder?.()
          }}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canReportFraud(transfer)}>
          <ButtonReportFraudTransfer tokenFullId={tokenFullId}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
          <ButtonCancelTransfer tokenFullId={tokenFullId} callback={reFetchOrder}/>
        </HideAction>
        <HideAction hide={!!transfer}>
          <Button
            secondary
            isDisabled
            fullWidth
          >
            NFT is not listed
          </Button>
        </HideAction>
      </>
  )
})
