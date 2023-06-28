import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveExchange } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'
import { ActionButtonProps } from './types/types'

export type ButtonApproveExchangeProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({
  tokenFullId, onStart, onEnd, isDisabled, onError,
}) => {
  const { approveExchange, ...statuses } = useApproveExchange({ ...tokenFullId })
  const { blockStore } = useStores()
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have approved FileMarket to list your EFT. You can now place an order',
    loadingMsg: 'At first, you need to approve FileMarket to list your EFT. After that you can place an order.',
  })

  useEffect(() => {
    if (statuses.result) blockStore.setRecieptBlock(statuses.result.blockNumber)
  }, [statuses.result])

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
          await approveExchange(tokenFullId).catch(e => {
            onError?.()
            throw e
          })
          onEnd?.()
        }}
      >
        Prepare for sale
      </Button>
    </>
  )
}
