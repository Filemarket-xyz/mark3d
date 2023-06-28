import { observer } from 'mobx-react-lite'
import { FC } from 'react'

import { Order } from '../../../../../../swagger/Api'
import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFulfillOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonFulfillOrderProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  order?: Order
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = observer(({
  tokenFullId,
  order,
  onStart,
  onEnd,
  isDisabled,
  onError,
}) => {
  const { fulfillOrder, ...statuses } = useFulfillOrder()
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the EFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order',
  })

  const { blockStore } = useStores()

  const onPress = async () => {
    onStart?.()
    const receipt = await fulfillOrder({
      ...tokenFullId,
      price: order?.price,
    }).catch(e => {
      onError?.()
      throw e
    })
    if (receipt?.blockNumber) {
      blockStore.setReceiptBlock(receipt.blockNumber)
    }
    onEnd?.()
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
