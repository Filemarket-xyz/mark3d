import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useFinalizeTransfer } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonFinalizeTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({ tokenFullId, callback }) => {
  const { finalizeTransfer, isLoading, result } = useFinalizeTransfer(tokenFullId)
  useEffect(() => {
    console.log('finalize transfer', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
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
  )
}
