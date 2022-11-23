import { Loading, Modal } from '@nextui-org/react'
import React from 'react'
import { styled } from '../../../styles'
import { Button, NavLink, textVariant } from '../../UIkit'

const ModalTitle = styled('h3', {
  ...textVariant('primary1'),
  fontSize: '$h5',
  color: '$blue900',
  fontWeight: 600,
  textAlign: 'center',
  paddingTop: '$3'
})

const ModalP = styled('p', {
  ...textVariant('primary1'),
  color: '$gray500',
  textAlign: 'center',
  paddingTop: '$2'
})

interface InProcessBodyProps {
  text: string
}
export const InProgressBody = ({ text }: InProcessBodyProps) => (
  <>
    <Loading size='xl' type='points' />
    <ModalTitle>{text}</ModalTitle>
    <ModalP>Please check your wallet and sign the transaction</ModalP>
  </>
)

interface SuccessBodyProps {
  buttonText: string
  link: string
}
export const SuccessBody = ({ buttonText, link }: SuccessBodyProps) => (
  <>
    <ModalTitle css={{ paddingTop: 0, marginBottom: '$4' }}>Success</ModalTitle>
    <NavLink
      to={link}
      css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Button primary>{buttonText}</Button>
    </NavLink>
  </>
)

export const extractMessageFromError = (error: string | undefined) => {
  const UNKNOWN_ERROR = 'Something went wrong, try again later'

  if (!error) return UNKNOWN_ERROR

  const errorPartToShow = error.split('\n').shift()
  if (!errorPartToShow) return UNKNOWN_ERROR

  try {
    const errorObject = JSON.parse(errorPartToShow)
    return errorObject.message ?? UNKNOWN_ERROR
  } catch {
    return errorPartToShow
  }
}

export const ErrorBody = ({ message }: { message: string }) => (
  <>
    <ModalTitle css={{ paddingTop: 0 }}>Error</ModalTitle>
    <ModalP css={{ color: '$red' }}>{message}</ModalP>
  </>
)

interface MintModalProps {
  open: boolean
  handleClose: () => void
  body: JSX.Element
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
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
