import { Modal } from '@nextui-org/react'
import { FC } from 'react'

import { useHookToCallback } from '../../../../../hooks/useHookToCallback'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { usePlaceOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { ModalTitle } from '../../../../../UIkit/Modal/Modal'
import MintModal from '../../../../Modal/Modal'
import { OrderForm } from '../../OrderForm'

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
    loadingMsg: 'Placing order',
  })

  return (
    <>
      <Modal
        closeButton
        open={modalOpen}
        onClose={closeModal}
      >
        <ModalTitle>Put on sale</ModalTitle>
        <Modal.Body>
          <OrderForm
            onSubmit={form => {
              closeModal()
              placeOrder(tokenFullId, form.price)
            }}
          />
        </Modal.Body>
      </Modal>
      <MintModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={openModal}
      >
        Put on sale
      </Button>
    </>
  )
}
