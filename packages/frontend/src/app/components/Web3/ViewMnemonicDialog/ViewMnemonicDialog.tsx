import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { useMediaMui } from '../../../hooks/useMediaMui'
import { useSeedProvider } from '../../../processing'
import { ButtonGlowing, Txt } from '../../../UIkit'
import { Modal, ModalBanner, ModalBody, ModalButtonContainer, ModalIcon, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { UnlockSection } from '../ConnectFileWalletDialog/sections/UnlockSection'
import ViewMnemonicSection from './ViewMnemonicSection/ViewMnemonicSection'

export function ViewMnemonicDialog({ open, onClose }: AppDialogProps<{}>): JSX.Element {
  const { adaptive } = useMediaMui()
  const { address } = useAccount()
  const [canWatch, setCanWatch] = useState<boolean>(false)
  const { seedProvider } = useSeedProvider(address)

  return (
    <Modal
      closeButton
      aria-labelledby='modal-title'
      open={open}
      width={adaptive({
        sm: !canWatch ? '400px' : '400px',
        md: !canWatch ? '650px' : '500px',
        lg: !canWatch ? '664px' : '710px',
        defaultValue: !canWatch ? '664px' : '710px',
      })}
      onClose={onClose}
    >
      <ModalTitle style={{ marginBottom: 0 }}>
        {' '}
        <ModalIcon />
        {' '}
        {canWatch ? 'FileWallet seed phrases' : 'Show FileWallet seed phrase'}
      </ModalTitle>
      <ModalBody style={{ paddingBottom: 0 }}>
        {canWatch
          ? (
            <>
              <ViewMnemonicSection mnemonic={seedProvider?.mnemonic ?? ''} />
              <ModalBanner>
                <Txt primary1 style={{ fontWeight: '400', lineHeight: '28px' }}>
                  This is a key to your files in EFTs.
                  {' '}
                  <Txt primary1 style={{ lineHeight: '24px' }}>
                    Keep it save
                  </Txt>
                </Txt>
              </ModalBanner>
              <ModalButtonContainer>
                <ButtonGlowing
                  modalButton
                  whiteWithBlue
                  modalButtonFontSize
                  onPress={onClose}
                >
                  Close
                </ButtonGlowing>
              </ModalButtonContainer>
            </>
          ) : (
            <UnlockSection onSuccess={() => {
              setCanWatch(true)
            }}
            />
          )
        }
      </ModalBody>
    </Modal>
  )
};
