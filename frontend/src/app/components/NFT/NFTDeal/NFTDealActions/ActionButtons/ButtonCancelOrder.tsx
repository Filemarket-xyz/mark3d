import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useCancelOrder } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
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
      <MintModal {...modalProps}/>
      <Button
        secondary
        fullWidth
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
