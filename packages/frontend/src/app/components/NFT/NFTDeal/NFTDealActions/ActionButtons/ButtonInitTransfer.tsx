import { Modal } from '@nextui-org/react'
import { FC, useEffect } from 'react'

import { useStores } from '../../../../../hooks'
import { useModalOpen } from '../../../../../hooks/useModalOpen'
import { useStatusModal } from '../../../../../hooks/useStatusModal'
import { useInitTransfer } from '../../../../../processing'
import { TokenFullId } from '../../../../../processing/types'
import { Button } from '../../../../../UIkit'
import { ModalTitle } from '../../../../../UIkit/Modal/Modal'
import BaseModal from '../../../../Modal/Modal'
import { TransferForm } from '../../TransferForm'
import { ActionButtonProps } from './types/types'

export type ButtonInitTransferProps = ActionButtonProps & {
  tokenFullId: TokenFullId
}

export const ButtonInitTransfer: FC<ButtonInitTransferProps> = ({ tokenFullId, isDisabled, callBack, onError }) => {
  const { modalOpen, openModal, closeModal } = useModalOpen()
  const { initTransfer, ...statuses } = useInitTransfer(tokenFullId)
  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Transfer initialized. Recipient should now accept it.',
    loadingMsg: 'Initializing transfer',
  })

  const { blockStore } = useStores()
  useEffect(() => {
    if (statuses.result) blockStore.setRecieptBlock(statuses.result.blockNumber)
  }, [statuses.result])

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
            onSubmit={async (form) => {
              closeModal()
              await initTransfer({
                tokenId: tokenFullId.tokenId,
                to: form.address,
              }).catch(() => {
                onError?.()
              })
              callBack?.()
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
