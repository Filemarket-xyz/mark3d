import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useApproveTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonApproveTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonApproveTransfer: FC<ButtonApproveTransferProps> = ({ tokenFullId, callback }) => {
  const { approveTransfer, isLoading, result } = useApproveTransfer(tokenFullId)
  useEffect(() => {
    console.log('approve transfer', 'isLoading', isLoading, 'result', result)
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
