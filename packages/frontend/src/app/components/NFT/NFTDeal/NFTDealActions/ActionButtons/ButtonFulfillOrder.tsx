import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import { Order } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFulfillOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonFulfillOrderProps {
  tokenFullId: TokenFullId
  order?: Order
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = observer(({
  tokenFullId,
  order,
  callBack,
  isDisabled,
}) => {
  const { fulfillOrder, ...statuses } = useFulfillOrder({ callBack })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the EFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order',
  })

  const onPress = async () => {
    await fulfillOrder({
      ...tokenFullId,
      price: order?.price,
    })
  }

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={onPress}
      >
        Buy now
      </Button>
    </>
  )
})
