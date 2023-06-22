import { Modal } from '@nextui-org/react'
import { FC } from 'react'

import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useInitTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { ModalTitle } from '../../../../../UIkit/Modal/Modal'
import BaseModal from '../../../../Modal/Modal'
import { TransferForm } from '../../TransferForm'

export interface ButtonInitTransferProps {
  tokenFullId: TokenFullId
  isDisabled?: boolean
}

export const ButtonInitTransfer: FC<ButtonInitTransferProps> = ({ tokenFullId, isDisabled }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { initTransfer, ...statuses } = useInitTransfer(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer initialized. Recipient should now accept it.',
    loadingMsg: 'Initializing transfer',
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
              initTransfer({
                tokenId: tokenFullId.tokenId,
                to: form.address,
              })
            }}
          />
        </Modal.Body>
      </Modal>
      <BaseModal {...modalProps} />
      <Button
        primary
        fullWidth
        borderRadiusSecond
        isDisabled={isLoading || isDisabled}
        onPress={openModal}
      >
        Gift
      </Button>
    </>
  )
}
