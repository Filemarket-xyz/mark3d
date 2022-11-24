import { Loading, Modal } from '@nextui-org/react'
import React, { FC, ReactNode } from 'react'
import { styled } from '../../../styles'
import { Button, NavLink, textVariant, Txt } from '../../UIkit'
import { stringifyError } from '../../utils/error'

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
  text: ReactNode
}
export const InProgressBody = ({ text }: InProcessBodyProps) => (
  <>
    <Loading size='xl' type='points' />
    <ModalTitle>{text}</ModalTitle>
    <ModalP>Please check your wallet and sign the transaction</ModalP>
  </>
)

const SuccessTitle = () => (
  <ModalTitle css={{ paddingTop: 0, marginBottom: '$4' }}>Success</ModalTitle>
)

interface SuccessNavBodyProps {
  buttonText: string
  link: string
}
export const SuccessNavBody = ({ buttonText, link }: SuccessNavBodyProps) => (
  <>
    <SuccessTitle/>
    <NavLink
      to={link}
      css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Button primary>{buttonText}</Button>
    </NavLink>
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
    <SuccessTitle/>
    <Txt>{description}</Txt>
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
    <ModalTitle css={{ paddingTop: 0 }}>Error</ModalTitle>
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
  header,
  footer
}: MintModalProps) {
  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  )
}
