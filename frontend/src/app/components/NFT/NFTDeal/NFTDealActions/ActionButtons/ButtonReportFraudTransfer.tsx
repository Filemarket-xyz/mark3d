import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useReportFraud } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonReportFraudTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonReportFraudTransfer: FC<ButtonReportFraudTransferProps> = ({ tokenFullId, callback }) => {
  const { reportFraud, ...statuses } = useReportFraud(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Fraud reported! Expect a decision within a few minutes',
    loadingMsg: 'Reporting fraud'
  })
  return (
    <>
      <MintModal {...modalProps}/>
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
    </>
  )
}
