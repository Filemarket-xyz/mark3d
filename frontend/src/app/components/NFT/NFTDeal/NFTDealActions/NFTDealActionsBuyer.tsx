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
import { toJS } from 'mobx'

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
  if (transfer) {
    console.log('transfer', toJS(transfer))
    return (
      <>
        {permissions.canFulfillOrder(transfer) && (
          <ButtonFulfillOrder tokenFullId={tokenFullId}/>
        )}
        {permissions.canSetPublicKey(transfer) && (
          <ButtonSetPublicKeyTransfer tokenFullId={tokenFullId}/>
        )}
        {permissions.canFinalize(transfer) && (
          <ButtonFinalizeTransfer tokenFullId={tokenFullId} callback={ownerStatusChanged}/>
        )}
        {permissions.canReportFraud(transfer) && (
          <ButtonReportFraudTransfer tokenFullId={tokenFullId}/>
        )}
        {permissions.canCancel(transfer) && (
          <ButtonCancelTransfer tokenFullId={tokenFullId}/>
        )}
      </>
    )
  }
  return (
    <Button
      secondary
      isDisabled
      fullWidth
    >
      NFT is not listed
    </Button>
  )
})
