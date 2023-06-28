import { FC } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useReportFraud } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonReportFraudTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonReportFraudTransfer: FC<ButtonReportFraudTransferProps> = ({
  tokenFullId,
  onStart,
  onEnd,
  isDisabled,
  onError,
}) => {
  const { reportFraud, ...statuses } = useReportFraud({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Fraud reported! Expect a decision within a few minutes',
    loadingMsg: 'Reporting fraud',
  })

  const { blockStore } = useStores()

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
          const receipt = await reportFraud(tokenFullId).catch(e => {
            onError?.()
            throw e
          })
          if (receipt?.blockNumber) {
            blockStore.setReceiptBlock(receipt.blockNumber)
          }
          onEnd?.()
        }}
      >
        Report fraud
      </Button>
    </>
  )
}
