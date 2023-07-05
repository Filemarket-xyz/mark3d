import React, { ReactNode } from 'react'

import { styled } from '../../../../../styles'
import { useMediaMui } from '../../../../hooks/useMediaMui'
import { ButtonGlowing, textVariant } from '../../../../UIkit'
import { Modal, ModalButtonContainer, ModalIcon, ModalTitle } from '../../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../../utils/dialog'
import RarityModalImg from '../../img/RarityModal.svg'

const FileBunniesModalBody = styled('div', {
  marginTop: '16px',
  marginBottom: '40px',
  ...textVariant('primary1').true,
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '28px',
  textAlign: 'left',
  '& p': {
    marginBottom: '4px',
  },
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
      <p>
        1.
        {' '}
        <a
          target={'_blank'}
          href={'https://medium.com/filemarket-xyz/how-to-buy-fil-and-use-fil-in-the-filecoin-virtual-machine-d67fa90764d5'}
          rel="noreferrer"
          style={{ textDecoration: 'underline', color: '#0090FF' }}
        >
          Top up your crypto wallet with FIL tokens
        </a>
        {' '}
        to pay for the network fee during Free Mint or to pay for Mint of other rarities.
      </p>
      <p>2. Connect your crypto wallet via Wallet Connect</p>
      <p>3. Create or connect your FileWallet</p>
      <p>4. Check if you&quot;re on the White List (if you&quot;re on the list, the Free Mint button will be active)</p>
      <p>5. Click Free Mint or Mint if you want to swap your FIL for EFT with higher rarity (the chances of getting any rarity are random)</p>
      <p>6. Wait for the transaction to appear and then sign it</p>
      <p>7. In the popped-up window, wait for the &quot;Show my FileBunny&quot; button to appear</p>
      <p>8. Wait for the automatic transfer of the hidden file with gifts on your FileBunny EFT page (after the transfer, the file will become available for download)</p>
      <p>9. Complete the transaction on the EFT page by clicking the &quot;Send payment&quot; or &quot;Finalize the deal&quot; button;</p>
      <p>10. Congratulations! You have become the lucky owner of your FileBunny! Download the file and enjoy the content. This is the NFT with real value inside!</p>
    </FileBunniesModalBody>
  )
}

export const HowWorkModalBody = () => {
  return (
    <FileBunniesModalBody>
      <p>
        FileMarket Labs company has created a new NFT standard and protocol
        for secure storage and transfer of files stored on the decentralized Filecoin storage. It&apos;s called Encrypted FileToken (EFT).
      </p>
      <p>
        When someone creates an EFT, besides a link to a public file available
        to everyone, there&apos;s another link to a file that gets encrypted with
        a special cryptographic key before being uploaded to Filecoin. Only
        the EFT owner has this key. Access to this key is stored inside FileWallet, which is created when first using the FileMarket platform.
      </p>
      <p>
        The EFT protocol allows a decentralized and completely secure transfer
        of the file encryption key to a new EFT owner, whether they get it as
        a gift or through a purchase in the marketplace.
      </p>
      <p>
        To do this, the EFT owner has to perform an additional transaction to
        transfer the hidden file, effectively passing the encrypted key to the
        file. After the file transfer, the buyer must finalize the deal on
        their end, confirming that the file has been received.
      </p>
      <p>The mechanics are similar to familiar p2p exchanges, but here you&apos;re trading file access for tokens.</p>
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
