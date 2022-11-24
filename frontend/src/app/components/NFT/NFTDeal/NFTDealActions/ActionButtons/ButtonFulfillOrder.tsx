import { TokenFullId } from '../../../../../processing/types'
import { FC } from 'react'
import { useFulfillOrder } from '../../../../../processing/hooks'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal from '../../../../Modal/Modal'

export interface ButtonFulfillOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonFulfillOrder: FC<ButtonFulfillOrderProps> = ({ tokenFullId, callback }) => {
  const { fulfillOrder, ...statuses } = useFulfillOrder(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the NFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order'
  })
  return (
    <>
      <MintModal {...modalProps}/>
      <Button
        secondary
        fullWidth
        onPress={async () => {
          await fulfillOrder()
          callback?.()
        }}
        isDisabled={isLoading}
      >
        Buy
      </Button>
    </>
  )
}
