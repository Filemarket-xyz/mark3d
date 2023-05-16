import { FC } from 'react'

import { Transfer } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import MintModal from '../../../../Modal/Modal'

export interface ButtonApproveTransferProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  callback?: () => void
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({ tokenFullId, transfer, callback }) => {
  const { approveTransfer, ...statuses } = useApproveTransfer(tokenFullId, transfer?.publicKey)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have granted hidden file access to the buyer',
    loadingMsg: 'Sending an encrypted encryption password'
  })
  return (
    <>
      <MintModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={async () => {
          await approveTransfer()
          callback?.()
        }}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
