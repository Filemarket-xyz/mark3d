import React, { ReactNode } from 'react'

import { styled } from '../../../../../styles'
import { useMediaMui } from '../../../../hooks/useMediaMui'
import { ButtonGlowing, textVariant } from '../../../../UIkit'
import { Modal, ModalButtonContainer, ModalIcon, ModalTitle } from '../../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../../utils/dialog'
import RarityModalImg from '../../img/RarityModal.png'

const FileBunniesModalBody = styled('div', {
  marginTop: '16px',
  marginBottom: '40px',
  ...textVariant('primary1').true,
  fontSize: '20px',
  fontWeight: '400',
  lineHeight: '28px',
})

const FileBunniesModalTitle = styled(ModalTitle, {})

export const RarityModalBody = () => {
  return (
    <FileBunniesModalBody>
      <img src={RarityModalImg} />
    </FileBunniesModalBody>
  )
}

export const HowMintModalBody = () => {
  return (
    <FileBunniesModalBody>
      Клубника бомба честно говоря
    </FileBunniesModalBody>
  )
}

export const HowWorkModalBody = () => {
  return (
    <FileBunniesModalBody>
      Клубника бомба честно говоря
    </FileBunniesModalBody>
  )
}

export const RarityModalTitle = () => {
  return (
    <FileBunniesModalTitle>
      <ModalIcon fileBunnies />
      How NFT with EFT works?
    </FileBunniesModalTitle>
  )
}

export const HowMintModalTitle = () => {
  return (
    <FileBunniesModalTitle>
      <ModalIcon fileBunnies />
      How to MINT FileBunnies?
    </FileBunniesModalTitle>
  )
}

export const HowWorkModalTitle = () => {
  return (
    <FileBunniesModalTitle>
      <ModalIcon fileBunnies />
      Rarity details
    </FileBunniesModalTitle>
  )
}

export const FileBunniesModal = ({ open, onClose, body, title }: AppDialogProps<{ body: ReactNode, title: ReactNode }>) => {
  const { adaptive, mdValue, smValue } = useMediaMui()

  return (
    <Modal
      closeButton
      open={open}
      width={adaptive({
        sm: '400px',
        md: '550px',
        lg: '743px',
        defaultValue: '743px',
      })}
      onClose={onClose}
    >
      {title}
      {body}
      <ModalButtonContainer>
        <ButtonGlowing
          whiteWithBlue
          modalButton
          modalButtonFontSize
          style={{ width: mdValue ? (smValue ? '260px' : '414px') : '272px' }}
          onPress={onClose}
        >
          Got it
        </ButtonGlowing>
      </ModalButtonContainer>
    </Modal>
  )
}
