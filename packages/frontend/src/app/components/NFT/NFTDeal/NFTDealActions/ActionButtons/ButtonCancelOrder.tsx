import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonCancelOrderProps {
  tokenFullId: TokenFullId
  callBack?: () => void
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, callBack }) => {
  const { cancelOrder, ...statuses } = useCancelOrder({ callBack })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order cancelled',
    loadingMsg: 'Cancelling order',
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
          await cancelOrder(tokenFullId)
        }}
      >
        Cancel order
      </Button>
    </>
  )
}
