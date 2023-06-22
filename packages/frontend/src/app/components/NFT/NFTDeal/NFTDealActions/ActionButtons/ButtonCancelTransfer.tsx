import { FC } from 'react'

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
  const { cancelTransfer, ...statuses } = useCancelTransfer({ ...tokenFullId, callBack })
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
        isDisabled={isLoading || isDisabled}
        onPress={async () => {
          await cancelTransfer(tokenFullId)
        }}
      >
        Cancel deal
      </Button>
    </>
  )
}
