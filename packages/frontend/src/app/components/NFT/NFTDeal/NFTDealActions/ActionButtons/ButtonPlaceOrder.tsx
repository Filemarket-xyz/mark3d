import React from 'react'

import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { usePlaceOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { Modal, ModalBody, ModalTitle } from '../../../../../UIkit/Modal/Modal'
import BaseModal from '../../../../Modal/Modal'
import { OrderForm, OrderFormValue } from '../../OrderForm'

export interface ButtonPlaceOrderProps {
  tokenFullId: TokenFullId
  callBack?: () => void
  isDisabled?: boolean
}

export const ButtonPlaceOrder: React.FC<ButtonPlaceOrderProps> = ({ tokenFullId, callBack, isDisabled }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { placeOrder, ...statuses } = usePlaceOrder()
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order placed! Now be ready to transfer hidden files, if someone fulfills the order.',
    loadingMsg: 'Placing order',
  })

  const onSubmit = async ({ price }: OrderFormValue) => {
    closeModal()
    await placeOrder({
      ...tokenFullId,
      price,
    })
    callBack?.()
  }

  return (
    <>
      <Modal
        closeButton
        open={modalOpen}
        width='465px'
        onClose={closeModal}
      >
        <ModalTitle>Put EFT on sale</ModalTitle>
        <ModalBody css={{ padding: 0 }}>
          <OrderForm
            tokenFullId={tokenFullId}
            onSubmit={onSubmit}
          />
        </ModalBody>
      </Modal>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={openModal}
      >
        Put on sale
      </Button>
    </>
  )
}
