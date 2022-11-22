import { Loading, Modal } from '@nextui-org/react'
import React from 'react'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

interface MintModalProps {
  open: boolean
  handleClose: () => void
}

const Title = styled('h3', {
  ...textVariant('primary1'),
  fontSize: '$h5',
  color: '$blue900',
  fontWeight: 600,
  textAlign: 'center',
  paddingTop: '$3'
})

const P = styled('p', {
  ...textVariant('primary1'),
  color: '$gray500',
  textAlign: 'center',
  paddingTop: '$2'
})

export default function MintModal({ handleClose, open }: MintModalProps) {
  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      onClose={handleClose}
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <Loading size='xl' type='points' />
        <Title>Collection is being minted</Title>
        <P>Please check your wallet and sign the transaction</P>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
