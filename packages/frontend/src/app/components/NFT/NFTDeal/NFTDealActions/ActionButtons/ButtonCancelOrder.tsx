import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonCancelOrderProps {
  tokenFullId: TokenFullId
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, callBack, isDisabled }) => {
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
        isDisabled={isLoading || isDisabled}
        onPress={async () => {
          await cancelOrder(tokenFullId)
        }}
      >
        Cancel order
      </Button>
    </>
  )
}
