import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonCancelOrderProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonCancelOrder: FC<ButtonCancelOrderProps> = ({ tokenFullId, callBack, isDisabled, onError }) => {
  const { cancelOrder, ...statuses } = useCancelOrder()
  const { isLoading } = statuses
  const { blockStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order cancelled',
    loadingMsg: 'Cancelling order',
  })

  useEffect(() => {
    if (statuses.result) blockStore.setRecieptBlock(statuses.result.blockNumber)
  }, [statuses.result])

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={async () => {
          await cancelOrder(tokenFullId).catch(() => {
            onError?.()
          })
          callBack?.()
        }}
      >
        Cancel order
      </Button>
    </>
  )
}
