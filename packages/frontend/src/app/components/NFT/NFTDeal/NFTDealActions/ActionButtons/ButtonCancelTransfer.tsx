import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonCancelTransferProps {
  tokenFullId: TokenFullId
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({ tokenFullId, callBack, isDisabled }) => {
  const { cancelTransfer, ...statuses } = useCancelTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { blockStore } = useStores()
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer cancelled',
    loadingMsg: 'Cancelling transfer',
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
          await cancelTransfer(tokenFullId)
          callBack?.()
        }}
      >
        Cancel deal
      </Button>
    </>
  )
}
