import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { Button } from '../../../../../UIkit'
import { useApproveExchange } from '../../../../../processing/hooks'

export interface ButtonApproveExchangeProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({ tokenFullId, callback }) => {
  const { approveExchange, isLoading } = useApproveExchange(tokenFullId)
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await approveExchange()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      List
    </Button>
  )
}
