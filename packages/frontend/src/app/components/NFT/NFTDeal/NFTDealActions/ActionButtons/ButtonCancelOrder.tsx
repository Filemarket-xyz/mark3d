import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import MintModal from '../../../../Modal/Modal'

export interface ButtonCancelOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, callback }) => {
  const { cancelOrder, ...statuses } = useCancelOrder(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order cancelled',
    loadingMsg: 'Cancelling order'
  })
  return (
    <>
      <MintModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        onPress={async () => {
          await cancelOrder()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Cancel order
      </Button>
    </>
  )
}
