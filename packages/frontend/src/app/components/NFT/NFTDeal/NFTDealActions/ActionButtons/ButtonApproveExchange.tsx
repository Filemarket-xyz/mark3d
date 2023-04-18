import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { Button } from '../../../../../UIkit'
import { useApproveExchange } from '../../../../../processing'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonApproveExchangeProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonApproveExchange: FC<ButtonApproveExchangeProps> = ({ tokenFullId, callback }) => {
  const { approveExchange, ...statuses } = useApproveExchange(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'You have approved FileMarket to list your NFT. You can now place an order',
    loadingMsg: 'At first, you need to approve FileMarket to list your NFT. After that you can place an order.'
  })
  return (
    <>
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        onPress={async () => {
          await approveExchange()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        List
      </Button>
    </>
  )
}
