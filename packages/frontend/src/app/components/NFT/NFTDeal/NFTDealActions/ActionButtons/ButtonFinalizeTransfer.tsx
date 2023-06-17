import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFinalizeTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonFinalizeTransferProps {
  tokenFullId: TokenFullId
  callBack?: () => void
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({ tokenFullId, callBack }) => {
  const { finalizeTransfer, ...statuses } = useFinalizeTransfer({ ...tokenFullId, callBack })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'The deal is finished!',
    loadingMsg: 'Finalizing the deal',
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
          await finalizeTransfer(tokenFullId)
        }}
      >
        Send payment
      </Button>
    </>
  )
}
