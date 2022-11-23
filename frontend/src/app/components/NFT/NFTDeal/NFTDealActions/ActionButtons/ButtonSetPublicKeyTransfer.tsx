import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { Button } from '../../../../../UIkit'
import { useSetPublicKey } from '../../../../../processing/hooks'

export interface ButtonSetPublicKeyTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonSetPublicKeyTransfer: FC<ButtonSetPublicKeyTransferProps> = ({ tokenFullId, callback }) => {
  const { setPublicKey, isLoading, result } = useSetPublicKey(tokenFullId)
  useEffect(() => {
    console.log('report fraud order', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await setPublicKey()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Accept transfer
    </Button>
  )
}
