import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useFinalizeTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
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
      <MintModal {...modalProps}/>
      <Button
        secondary
        fullWidth
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
