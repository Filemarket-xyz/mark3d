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
  textAlign: 'left',
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
      1. Connect your crypto wallet via Wallet Connect.
      {' '}
      <br />
      2. Create or connect your FileWallet.
      {' '}
      <br />
      3. if you&apos;re on the list, the Free Mint button will be active.
      {' '}
      <br />
      4. Click Free Mint or Mint if you want to swap your FIL for EFT with higher rarity (the chances of getting any rarity are random).
      {' '}
      <br />
      5. Wait for the transaction to appear and then sign it.
      {' '}
      <br />
      6. After a successful transaction, you will be able to see your eft on profile page after 4 minutes.
      {' '}
      <br />
    </FileBunniesModalBody>
  )
}

export const HowWorkModalBody = () => {
  return (
    <FileBunniesModalBody>
      FileBunnies holders will be granted exclusive
      access to all future NFT mints that occur on the FileMarket platform.
      This unique utility will allow the holder a White List spot for
      all content built on FileMarket.
    </FileBunniesModalBody>
  )
}

export const RarityModalTitle = () => {
  return (
    <FileBunniesModalTitle>
      <ModalIcon fileBunnies />
      Rarity details
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
      How EFT (Encrypted FileToken) works?
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
      <ModalButtonContainer style={{ marginTop: 0 }}>
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
