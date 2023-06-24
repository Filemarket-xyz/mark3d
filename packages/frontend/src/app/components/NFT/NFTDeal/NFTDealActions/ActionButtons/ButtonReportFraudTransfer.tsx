import { FC } from 'react'

import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useReportFraud } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonReportFraudTransferProps {
  tokenFullId: TokenFullId
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonReportFraudTransfer: FC<ButtonReportFraudTransferProps> = ({ tokenFullId, callBack, isDisabled }) => {
  const { reportFraud, ...statuses } = useReportFraud({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Fraud reported! Expect a decision within a few minutes',
    loadingMsg: 'Reporting fraud',
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
          await reportFraud(tokenFullId)
          callBack?.()
        }}
      >
        Report fraud
      </Button>
    </>
  )
}
