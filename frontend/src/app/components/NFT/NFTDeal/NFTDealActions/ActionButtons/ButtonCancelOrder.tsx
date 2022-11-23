import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useCancelOrder } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonCancelOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, callback }) => {
  const { cancelOrder, isLoading, result } = useCancelOrder(tokenFullId)
  useEffect(() => {
    console.log('cancel order', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
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
  )
}
