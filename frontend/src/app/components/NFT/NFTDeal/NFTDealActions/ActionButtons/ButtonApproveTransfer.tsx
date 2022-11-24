import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useApproveTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { Transfer } from '../../../../../../swagger/Api'

export interface ButtonApproveTransferProps {
  tokenFullId: TokenFullId
  transfer: Transfer
  callback?: () => void
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({ tokenFullId, transfer, callback }) => {
  const { approveTransfer, isLoading, result, error } = useApproveTransfer(tokenFullId, transfer.publicKey)
  useEffect(() => {
    console.log('approve transfer', 'isLoading', isLoading, 'result', result, 'error', error)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await approveTransfer()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Transfer hidden file
    </Button>
  )
}
