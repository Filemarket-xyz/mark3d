import { FC } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useFinalizeTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonFinalizeTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonFinalizeTransfer: FC<ButtonFinalizeTransferProps> = ({
  tokenFullId, onStart, onEnd, isDisabled, onError,
}) => {
  const { finalizeTransfer, ...statuses } = useFinalizeTransfer({ ...tokenFullId })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'The deal is finished!',
    loadingMsg: 'Finalizing the deal',
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
          const receipt = await finalizeTransfer(tokenFullId).catch(e => {
            onError?.()
            throw e
          })
          if (receipt?.blockNumber) {
            blockStore.setReceiptBlock(receipt.blockNumber)
          }
          onEnd?.()
        }}
      >
        Send payment
      </Button>
    </>
  )
}
