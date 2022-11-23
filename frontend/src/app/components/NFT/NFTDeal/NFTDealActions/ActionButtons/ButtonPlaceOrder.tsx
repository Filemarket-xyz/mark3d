import { FC, useEffect } from 'react'
import { usePlaceOrder } from '../../../../../processing/hooks'
import { TokenFullId } from '../../../../../processing/types'
import { BigNumber } from 'ethers'
import { Button } from '../../../../../UIkit'

export interface ButtonPlaceOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonPlaceOrder: FC<ButtonPlaceOrderProps> = ({ tokenFullId, callback }) => {
  const { placeOrder, isLoading, result } = usePlaceOrder(tokenFullId, BigNumber.from('1337'))
  useEffect(() => {
    console.log('place order', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await placeOrder()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Place order
    </Button>
  )
}
