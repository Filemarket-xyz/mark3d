import { Loading, Modal } from '@nextui-org/react'
import React, { FC, ReactNode } from 'react'

import { styled } from '../../../styles'
import { Button, NavButton, textVariant } from '../../UIkit'
import { stringifyError } from '../../utils/error'

export const ModalTitle = styled('h3', {
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
  text: ReactNode
  waitForSign?: boolean
}
export const InProgressBody: React.FC<InProcessBodyProps> = ({ text, waitForSign = true }) => (
  <>
    <Loading size='xl' type='points' />
    <ModalTitle>{text}</ModalTitle>
    {waitForSign && <ModalP>Please check your wallet and sign the transaction</ModalP>}
  </>
)

interface SuccessNavBodyProps {
  buttonText: string
  link: string
}
export const SuccessNavBody = ({ buttonText, link }: SuccessNavBodyProps) => (
  <>
    <ModalTitle css={{ marginBottom: '$4' }}>Success</ModalTitle>
    <Center>
      <NavButton
        primary
        to={link}
        type="button"
      >
        {buttonText}
      </NavButton>
    </Center>
  </>
)

export interface SuccessOkBodyProps {
  description: ReactNode
  handleClose?: () => void
}

const Center = styled('div', {
  dflex: 'center'
})

export const SuccessOkBody: FC<SuccessOkBodyProps> = ({ description, handleClose }) => (
  <>
    <ModalTitle>Success</ModalTitle>
    <ModalP>{description}</ModalP>
    {handleClose && (
      <Center>
        <Button secondary onPress={handleClose}>Ok</Button>
      </Center>
    )}
  </>
)

export const extractMessageFromError = (error: any) => {
  const UNKNOWN_ERROR = 'Something went wrong, try again later'

  if (!error) return UNKNOWN_ERROR
  if (typeof error === 'string') {
    const errorPartToShow = error.split('\n').shift()
    if (!errorPartToShow) return UNKNOWN_ERROR
    try {
      const errorObject = JSON.parse(errorPartToShow)
      return errorObject.message ?? stringifyError(error)
    } catch {
      return errorPartToShow
    }
  }
  return stringifyError(error)
}

export const ErrorBody = ({ message }: { message: string }) => (
  <>
    <ModalTitle>Error</ModalTitle>
    <ModalP css={{ color: '$red', wordBreak: 'break-all' }}>{message}</ModalP>
  </>
)

interface MintModalProps {
  open: boolean
  handleClose: () => void
  body: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

export default function MintModal({
  handleClose,
  open,
  body,
  footer
}: MintModalProps) {
  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      onClose={handleClose}
    >
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  )
}
