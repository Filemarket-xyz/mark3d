import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFinalizeTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import MintModal from '../../../../Modal/Modal'

export interface ButtonFinalizeTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({ tokenFullId, callback }) => {
  const { finalizeTransfer, ...statuses } = useFinalizeTransfer(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'The deal is finished!',
    loadingMsg: 'Finalizing the deal'
  })
  return (
    <>
      <MintModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        onPress={async () => {
          await finalizeTransfer()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Send payment
      </Button>
    </>
  )
}
