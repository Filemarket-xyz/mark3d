import { FC, useCallback, useState } from 'react'
import { usePlaceOrder } from '../../../../../processing/hooks'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import MintModal, { ModalTitle } from '../../../../Modal/Modal'
import { Modal } from '@nextui-org/react'
import { OrderForm, OrderFormValue } from '../../OrderForm'

export interface ButtonPlaceOrderProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonPlaceOrder: FC<ButtonPlaceOrderProps> = ({ tokenFullId, callback }) => {
  const [modalOpen, setModalOpen] = useState<boolean>()
  const closeModal = useCallback(() => setModalOpen(false), [modalOpen])
  const openModal = useCallback(() => setModalOpen(true), [modalOpen])
  const [form, setForm] = useState<OrderFormValue>()
  const { placeOrder, ...statuses } = usePlaceOrder(tokenFullId, form?.price)
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
            preSubmit={setForm}
            onSubmit={async () => {
              closeModal()
              await placeOrder()
              callback?.()
            }}
          />
        </Modal.Body>
      </Modal>
      <MintModal {...modalProps}/>
      <Button
        secondary
        fullWidth
        onPress={openModal}
        isDisabled={isLoading}
      >
        Place order
      </Button>
    </>
  )
}
