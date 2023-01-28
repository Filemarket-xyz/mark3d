import { FC } from 'react'
import { usePlaceOrder } from '../../../../../processing/hooks'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal, { ModalTitle } from '../../../../Modal/Modal'
import { Modal } from '@nextui-org/react'
import { OrderForm } from '../../OrderForm'
import { useHookToCallback } from '../../../../../hooks/useHookToCallback'
import { useModalOpen } from '../../../../../hooks/useModalOpen'

export interface ButtonPlaceOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonPlaceOrder: FC<ButtonPlaceOrderProps> = ({ tokenFullId, callback }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { placeOrder, ...statuses } = useHookToCallback(usePlaceOrder, 'placeOrder', { callbackOk: callback })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order placed! Now be ready to transfer hidden files, if someone fulfills the order.',
    loadingMsg: 'Placing order'
  })
  return (
    <>
      <Modal
        closeButton
        open={modalOpen}
        onClose={closeModal}
      >
        <ModalTitle>Order</ModalTitle>
        <Modal.Body>
          <OrderForm
            onSubmit={form => {
              closeModal()
              placeOrder(tokenFullId, form.price)
            }}
          />
        </Modal.Body>
      </Modal>
      <MintModal {...modalProps}/>
      <Button
        primary
        fullWidth
        onPress={openModal}
        isDisabled={isLoading}
      >
        Place order
      </Button>
    </>
  )
}
