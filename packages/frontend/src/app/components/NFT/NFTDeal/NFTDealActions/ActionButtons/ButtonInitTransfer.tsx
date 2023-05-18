import { Modal } from '@nextui-org/react'
import { FC } from 'react'

import { useHookToCallback } from '../../../../../hooks/useHookToCallback'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useInitTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import MintModal, { ModalTitle } from '../../../../Modal/Modal'
import { TransferForm } from '../../TransferForm'

export interface ButtonInitTransferProps {
  tokenFullId: TokenFullId
  callback?: () => void
}

export const ButtonInitTransfer: FC<ButtonInitTransferProps> = ({ tokenFullId, callback }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { initTransfer, ...statuses } = useHookToCallback(useInitTransfer, 'initTransfer', { callbackOk: callback })
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer initialized. Recipient should now accept it.',
    loadingMsg: 'Initializing transfer'
  })
  return (
    <>
      <Modal
        closeButton
        open={modalOpen}
        onClose={closeModal}
      >
        <ModalTitle>Gift</ModalTitle>
        <Modal.Body>
          <TransferForm
            onSubmit={form => {
              closeModal()
              initTransfer(tokenFullId, form.address)
            }}
          />
        </Modal.Body>
      </Modal>
      <MintModal {...modalProps} ></MintModal>
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading}
        onPress={openModal}
      >
        Gift
      </Button>
    </>
  )
}
