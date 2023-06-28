import { FC, useEffect } from 'react'

import { Transfer } from '../../../../../../swagger/Api'
import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonApproveTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
  transfer?: Transfer
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({
  tokenFullId, transfer, onStart, onEnd, isDisabled, onError,
}) => {
  const { approveTransfer, ...statuses } = useApproveTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have granted hidden file access to the buyer',
    loadingMsg: 'Sending an encrypted encryption password',
  })
  const { blockStore } = useStores()
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
          onStart?.()
          await approveTransfer({
            tokenId: tokenFullId.tokenId,
            publicKey: transfer?.publicKey,
          }).catch(e => {
            onError?.()
            throw e
          })
          onEnd?.()
        }}
      >
        Transfer hidden file
      </Button>
    </>
  )
}
