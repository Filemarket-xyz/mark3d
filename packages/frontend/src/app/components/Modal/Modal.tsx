import React, { FC, ReactNode } from 'react'

import LoadingIcon from '../../../assets/img/LoadingIconModal.svg'
import SuccessfullImg from '../../../assets/img/SuccesfullIcon.svg'
import { styled } from '../../../styles'
import { ButtonGlowing, ButtonNavGlowing } from '../../UIkit'
import { Modal, ModalBody, ModalButtonContainer, ModalP, ModalTitle } from '../../UIkit/Modal/Modal'
import { stringifyError } from '../../utils/error'

interface InProcessBodyProps {
  text: ReactNode
  waitForSign?: boolean
}

const Loading = styled('img', {
  width: '130px',
  marginBottom: '20px',
})

export const InProgressBody: React.FC<InProcessBodyProps> = ({ text, waitForSign = true }) => (
  <>
    <Loading src={LoadingIcon} />
    <ModalTitle>{text}</ModalTitle>
    {waitForSign && <ModalP style={{ fontSize: '16px' }}>Please check your wallet and sign the transaction</ModalP>}
  </>
)

interface SuccessNavBodyProps {
  buttonText: string
  link: string
  onPress: () => void
}
export const SuccessNavBody = ({ buttonText, link, onPress }: SuccessNavBodyProps) => {
  return (
    <>
      <ModalTitle style={{ marginBottom: '40px' }}><img src={SuccessfullImg} /></ModalTitle>
      <ModalP style={{ marginBottom: '40px' }}>Success</ModalP>
      <ModalButtonContainer style={{ justifyContent: 'center' }}>
        <ButtonNavGlowing
          whiteWithBlue
          modalButton
          to={link}
          onPress={onPress}
        >
          {buttonText}
        </ButtonNavGlowing>
      </ModalButtonContainer>
    </>
  )
}
export interface SuccessOkBodyProps {
  description: ReactNode
  handleClose?: () => void
}

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
          console.log(onClose)
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
  isError?: boolean
  isLoading?: boolean
}

export default function BaseModal({
  handleClose,
  open,
  body,
  footer,
  onOpen,
  isError,
  isLoading,
}: MintModalProps) {
  return (
    <Modal
      aria-labelledby='modal-title'
      open={open}
      width={'max-content'}
      isError={isError}
      preventClose={isLoading}
      style={{
        maxWidth: '690px',
      }}
      onClose={handleClose}
      onOpen={onOpen}
    >
      {body && <ModalBody style={{ padding: 0 }}>{body}</ModalBody>}
      {footer}
    </Modal>
  )
}
