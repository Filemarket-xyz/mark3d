import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useCancelTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonCancelTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonCancelTransfer: FC<ButtonCancelTransferProps> = ({ tokenFullId, callback }) => {
  const { cancelTransfer, isLoading, result } = useCancelTransfer(tokenFullId)
  useEffect(() => {
    console.log('cancel transfer', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await cancelTransfer()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Cancel deal
    </Button>
  )
}
