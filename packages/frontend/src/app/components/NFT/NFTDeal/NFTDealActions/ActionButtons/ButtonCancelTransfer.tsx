import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useCancelTransfer } from '../../../../../processing'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonCancelTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({ tokenFullId, callback }) => {
  const { cancelTransfer, ...statuses } = useCancelTransfer(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer cancelled',
    loadingMsg: 'Cancelling transfer'
  })
  return (
    <>
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        borderRadiusSecond
        onPress={async () => {
          await cancelTransfer()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Cancel deal
      </Button>
    </>
  )
}
