import { FC } from 'react'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { useHookToCallback } from '../../../../../hooks/useHookToCallback'
import { useInitTransfer } from '../../../../../processing/hooks'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { Modal } from '@nextui-org/react'
import MintModal, { ModalTitle } from '../../../../Modal/Modal'
import { TransferForm } from '../../TransferForm'
import { useStatusModal } from '../../../../../hooks/useStatusModal'

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
        onPress={openModal}
        isDisabled={isLoading}
      >
        Gift
      </Button>
    </>
  )
}
