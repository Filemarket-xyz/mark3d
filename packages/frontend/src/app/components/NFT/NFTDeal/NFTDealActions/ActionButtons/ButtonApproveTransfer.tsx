import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useApproveTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { Transfer } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
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
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        onPress={async () => {
          await approveTransfer()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
