import React, { useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useConversionRateStore } from '../../../../../hooks/useConversionRateStore'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { usePlaceOrder } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { Modal, ModalBody, ModalTitle } from '../../../../../UIkit/Modal/Modal'
import { toCurrency } from '../../../../../utils/web3'
import BaseModal from '../../../../Modal/Modal'
import { OrderForm, OrderFormValue } from '../../OrderForm'
import { ActionButtonProps } from './types/types'

export type ButtonPlaceOrderProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonPlaceOrder: React.FC<ButtonPlaceOrderProps> = ({ tokenFullId, callBack, isDisabled, onError }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { placeOrder, ...statuses } = usePlaceOrder()
  const conversionRateStore = useConversionRateStore()
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
    }).catch(() => {
      onError?.()
    })
    localStorage.setItem('priceEFT', price.toString())
    conversionRateStore.data?.rate && localStorage.setItem('priceEFTUSD', (conversionRateStore.data?.rate * toCurrency(price)).toString())
    callBack?.()
  }

  const { blockStore } = useStores()
  useEffect(() => {
    if (statuses.result) blockStore.setRecieptBlock(statuses.result.blockNumber)
  }, [statuses.result])

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
