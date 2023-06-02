import { Modal } from '@nextui-org/react'
import React, { ReactNode } from 'react'

import { styled } from '../../../styles'
import { useMediaMui } from '../../hooks/useMediaMui'
import { ModalTitle } from '../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../utils/dialog'

const InfoModalStyle = styled('div', {
  width: '85%',
  position: 'relative',
  margin: '0 auto',
  fontSize: '12px',
  paddingTop: '16px',
  paddingBottom: 'calc(1.25rem + 16px)',
})

type InfoModalProps = AppDialogProps<{
  open: boolean
  body: ReactNode
  header: ReactNode
}>

export function InfoModal({ open, onClose, header, body }: InfoModalProps): JSX.Element {
  const { adaptive } = useMediaMui()

  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      width={adaptive({
        sm: '400px',
        md: '650px',
        lg: '950px',
        defaultValue: '950px',
      })}
      onClose={onClose}
    >
      <ModalTitle>{header}</ModalTitle>
      <InfoModalStyle>{body}</InfoModalStyle>
    </Modal>
  )
}
