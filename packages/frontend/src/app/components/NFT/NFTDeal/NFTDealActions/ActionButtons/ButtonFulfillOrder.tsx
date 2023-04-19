import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useFulfillOrder } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'
import { Order } from '../../../../../../swagger/Api'
import { observer } from 'mobx-react-lite'

export interface ButtonFulfillOrderProps {
  tokenFullId: TokenFullId
  order?: Order
  callback?: () => void
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = observer(({ tokenFullId, order, callback }) => {
  const { fulfillOrder, ...statuses } = useFulfillOrder(tokenFullId, order?.price)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the NFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order'
  })
  return (
    <>
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        borderRadiusSecond
        onPress={async () => {
          await fulfillOrder()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Buy now
      </Button>
    </>
  )
})
