import { TokenFullId } from '../../../../../processing/types'
import { FC, useEffect } from 'react'
import { useReportFraud } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'

export interface ButtonReportFraudTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonReportFraudTransfer: FC<ButtonReportFraudTransferProps> = ({ tokenFullId, callback }) => {
  const { reportFraud, isLoading, result } = useReportFraud(tokenFullId)
  useEffect(() => {
    console.log('report fraud order', 'isLoading', isLoading, 'result', result)
  }, [isLoading, result])
  return (
    <Button
      secondary
      fullWidth
      onPress={async () => {
        await reportFraud()
        callback?.()
      }}
      isDisabled={isLoading}
    >
      Report fraud
    </Button>
  )
}
