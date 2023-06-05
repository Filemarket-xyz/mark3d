import { Loading } from '@nextui-org/react'
import React, { FC, ReactNode } from 'react'

import SuccessfullImg from '../../../assets/img/SuccesfullIcon.svg'
import { styled } from '../../../styles'
import { ButtonGlowing, NavButton } from '../../UIkit'
import { Modal, ModalBody, ModalButtonContainer, ModalP, ModalTitle } from '../../UIkit/Modal/Modal'
import { stringifyError } from '../../utils/error'

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
  flex: 'center',
})

export const SuccessOkBody: FC<SuccessOkBodyProps> = ({ description, handleClose }) => (
  <>
    <ModalTitle style={{ marginBottom: '40px' }}><img src={SuccessfullImg} /></ModalTitle>
    <ModalP style={{ marginBottom: '40px' }}>{description}</ModalP>
    {handleClose && (
      <ModalButtonContainer style={{ justifyContent: 'center' }}>
        <ButtonGlowing whiteWithBlue modalButton onPress={handleClose}>Cool</ButtonGlowing>
      </ModalButtonContainer>
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

export const ErrorBody = ({ message, onClose }: { message: string, onClose?: () => void }) => (
  <>
    <ModalTitle style={{ color: '#C54B5C' }}>Error</ModalTitle>
    <ModalP css={{ fontSize: '16px', fontWeight: '400', wordBreak: 'break-all', textAlign: 'center' }}>{message}</ModalP>
    <ModalButtonContainer>
      <ButtonGlowing
        modalButton
        whiteWithBlue
        modalButtonFontSize
        onPress={() => {
          onClose?.()
        }}
      >
        Got it
      </ButtonGlowing>
    </ModalButtonContainer>
  </>
)

interface MintModalProps {
  open: boolean
  handleClose: () => void
  body?: ReactNode
  footer?: ReactNode
  onOpen?: () => void
}

export default function MintModal({
  handleClose,
  open,
  body,
  footer,
  onOpen,
}: MintModalProps) {
  return (
    <Modal
      aria-labelledby='modal-title'
      open={open}
      width={'max-content'}
      onClose={handleClose}
      onOpen={onOpen}
    >
      {body && <ModalBody style={{ padding: 0 }}>{body}</ModalBody>}
      {footer}
    </Modal>
  )
}
