import { observer } from 'mobx-react-lite'
import { Transfer } from '../../../../../swagger/Api'
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
  ownerStatusChanged?: () => void
}

const permissions = transferPermissions.buyer

export const NFTDealActionsBuyer: FC<NFTDealActionsBuyerProps> = observer(({
  transfer,
  tokenFullId,
  ownerStatusChanged
}) => {
  return (
      <>
        <HideAction hide={!transfer || !permissions.canFulfillOrder(transfer)}>
          <ButtonFulfillOrder tokenFullId={tokenFullId}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canSetPublicKey(transfer)}>
          <ButtonSetPublicKeyTransfer tokenFullId={tokenFullId}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canFinalize(transfer)}>
          <ButtonFinalizeTransfer tokenFullId={tokenFullId} callback={ownerStatusChanged}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canReportFraud(transfer)}>
          <ButtonReportFraudTransfer tokenFullId={tokenFullId}/>
        </HideAction>
        <HideAction hide={!transfer || !permissions.canCancel(transfer)}>
          <ButtonCancelTransfer tokenFullId={tokenFullId}/>
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
