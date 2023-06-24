import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useCancelTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonCancelTransferProps {
  tokenFullId: TokenFullId
  callBack?: () => void
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({ tokenFullId, callBack }) => {
  const { cancelTransfer, ...statuses } = useCancelTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer cancelled',
    loadingMsg: 'Cancelling transfer',
  })

  return (
    <>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
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
