import { Modal as ModalBase } from '@nextui-org/react'
import React, { ComponentProps } from 'react'

import CloseButtonImg from '../../../assets/img/CloseButton.svg'
import FWIconImg from '../../../assets/img/FWicon.svg'
import { styled } from '../../../styles'
import { FormControl } from '../Form/FormControl'
import { textVariant } from '../Txt'

const CloseButton = styled('div', {
  position: 'absolute',
  top: '24px',
  right: '24px',
  cursor: 'pointer',
  '&:hover': {
    filter: 'brightness(2)',
  },
  '@sm': {
    top: '8px',
    right: '8px',
    transform: 'scale(0.7)',
  },
})

export const FWIcon = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  background: `url(${FWIconImg})`,
  height: '100%',
  width: '100%',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
})

export const modalStyle = {
  background: '#F9F9F9',
  border: '2px solid #232528',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  borderRadius: '16px',
  padding: '32px',
  position: 'relative',
}

export const FormControlModal = styled(FormControl, {
  marginBottom: '24px',
  maxWidth: 'inherit',
})

export const Modal = (props: ComponentProps<typeof ModalBase>) => {
  return (
    <ModalBase
      {...props}
      css={{
        ...modalStyle,
        ...props.css,
        color: '#232528',
      }}
    >
      {props.children}
      <CloseButton onClick={props.onClose}>
        <img src={CloseButtonImg} />
      </CloseButton>
    </ModalBase>
  )
}

export const ModalBody = styled('div', {
  paddingTB: '40px',
})

export const ModalTitle = styled('h3', {
  ...textVariant('primary1').true,
  fontSize: '24px',
  color: '$blue900',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: '16px',
  position: 'relative',
  '@sm': {
    fontSize: '20px',
  },
})

export const ModalP = styled('p', {
  ...textVariant('primary1').true,
  fontSize: '24px',
  textAlign: 'center',
})

export const ModalDescription = styled('p', {
  ...textVariant('primary1').true,
  fontWeight: '400',
  color: '$gray600',
  textAlign: 'center',
  paddingBottom: '40px',
  lineHeight: '24px',
})

export const ModalBanner = styled('div', {
  textAlign: 'left',
  marginTop: '40px',
  padding: '16px 24px',
  background: 'rgba(0, 144, 255, 0.05)',
  border: '1px solid rgba(0, 144, 255, 0.25)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const ModalButtonContainer = styled('div', {
  marginTop: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const InputModalTitleText = styled('p', {
  ...textVariant('primary1').true,
  fontWeight: '600',
  marginBottom: '8px',
  paddingLeft: '16px',
  textAlign: 'left',
  color: '#232528',
})
