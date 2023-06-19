import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveExchange } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonApproveExchangeProps {
  tokenFullId: TokenFullId
  callBack?: () => void
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({ tokenFullId, callBack }) => {
  const { approveExchange, ...statuses } = useApproveExchange({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have approved FileMarket to list your EFT. You can now place an order',
    loadingMsg: 'At first, you need to approve FileMarket to list your EFT. After that you can place an order.',
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={async () => {
          await approveExchange(tokenFullId)
          callBack?.()
        }}
      >
        Prepare for sale
      </Button>
    </>
  )
}
