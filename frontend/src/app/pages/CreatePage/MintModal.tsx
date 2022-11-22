import { Loading, Modal } from '@nextui-org/react'
import React from 'react'

interface MintModalProps {
  open: boolean
  handleClose: () => void
  body: () => JSX.Element
}

export default function MintModal({ handleClose, open, body }: MintModalProps) {
  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      onClose={handleClose}
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>{body()}</Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
