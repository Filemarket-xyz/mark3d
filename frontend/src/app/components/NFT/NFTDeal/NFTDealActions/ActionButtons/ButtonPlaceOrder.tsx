import { FC } from 'react'
import { usePlaceOrder } from '../../../../../processing/hooks'
import { TokenFullId } from '../../../../../processing/types'
import { BigNumber } from 'ethers'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonPlaceOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonPlaceOrder: FC<ButtonPlaceOrderProps> = ({ tokenFullId, callback }) => {
  const { placeOrder, ...statuses } = usePlaceOrder(tokenFullId, BigNumber.from('1337'))
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order placed! Now be ready to transfer hidden files, if someone fulfills the order.',
    loadingMsg: 'Placing order'
  })
  return (
    <>
      <MintModal {...modalProps}/>
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
    </>
  )
}
