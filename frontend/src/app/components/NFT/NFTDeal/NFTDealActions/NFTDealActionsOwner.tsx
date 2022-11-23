import { Transfer } from '../../../../../swagger/Api'
import { TokenFullId } from '../../../../processing/types'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { ButtonInitTransfer } from './ActionButtons/ButtonInitTransfer'
import { useIsApprovedExchange } from '../../../../processing/hooks/useIsApprovedExchange'
import { Txt } from '../../../../UIkit'
import { stringifyError } from '../../../../utils/error'
import { ButtonApproveExchange } from './ActionButtons/ButtonApproveExchange'
import { ButtonPlaceOrder } from './ActionButtons/ButtonPlaceOrder'

export interface NFTDealActionsOwnerProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const NFTDealActionOwner: FC<NFTDealActionsOwnerProps> = observer(({ transfer, tokenFullId }) => {
  const { isApprovedExchange, error: isApprovedExchangeError, refetch } = useIsApprovedExchange(tokenFullId)
  const error = isApprovedExchangeError
  if (error) {
    return (
      <Txt color="red">
        {stringifyError(error)}
      </Txt>
    )
  }
  if (transfer) {
    return <div>Transfer</div>
  }
  if (isApprovedExchange) {
    return <ButtonPlaceOrder tokenFullId={tokenFullId}/>
  }
  return (
    <>
      <ButtonInitTransfer tokenFullId={tokenFullId}/>
      <ButtonApproveExchange
        tokenFullId={tokenFullId}
        callback={refetch}
      />
    </>
  )
})
