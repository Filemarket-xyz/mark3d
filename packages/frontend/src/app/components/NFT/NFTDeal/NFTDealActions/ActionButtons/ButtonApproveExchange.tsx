import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useApproveExchange } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import BaseModal from '../../../../Modal/Modal'

export interface ButtonApproveExchangeProps {
  tokenFullId: TokenFullId
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({ tokenFullId, callBack, isDisabled }) => {
  const { approveExchange, ...statuses } = useApproveExchange({ ...tokenFullId, callBack })
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
          await approveExchange(tokenFullId)
        }}
      >
        Prepare for sale
      </Button>
    </>
  )
}
