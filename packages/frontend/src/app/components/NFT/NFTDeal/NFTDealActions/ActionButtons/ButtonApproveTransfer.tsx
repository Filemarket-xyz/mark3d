import { FC } from 'react'

import { Transfer } from '../../../../../../swagger/Api'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonApproveTransferProps {
  tokenFullId: TokenFullId
  transfer?: Transfer
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({ tokenFullId, transfer, callBack, isDisabled }) => {
  const { approveTransfer, ...statuses } = useApproveTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have granted hidden file access to the buyer',
    loadingMsg: 'Sending an encrypted encryption password',
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
          await approveTransfer({
            tokenId: tokenFullId.tokenId,
            publicKey: transfer?.publicKey,
          })
          callBack?.()
        }}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
