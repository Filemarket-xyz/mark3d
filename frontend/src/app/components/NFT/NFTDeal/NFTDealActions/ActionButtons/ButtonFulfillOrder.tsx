import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useFulfillOrder } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonFulfillOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = ({ tokenFullId, callback }) => {
  const { fulfillOrder, isLoading, result } = useFulfillOrder(tokenFullId)
  useEffect(() => {
    console.log('fulfill order', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await fulfillOrder()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Buy
    </Button>
  )
}
