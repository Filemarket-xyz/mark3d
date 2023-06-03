import { mnemonicToEntropy } from 'bip39'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useSeedProviderFactory } from '../../../processing'
import { ButtonGlowing } from '../../../UIkit'
import { FWIcon, Modal, ModalButtonContainer, modalStyle, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { createMnemonic } from '../ConnectFileWalletDialog/utils/createMnemonic'
import ShowMnemonic from '../ShowMnemonic/ShowMnemonic'
import { CreatePasswordForm } from './CreatePasswordForm/CreatePasswordForm'

const CreatedMnemonicStyle = styled('div', {
  width: '100%',
  position: 'relative',
  margin: '0 auto',
})

interface CreateMnemonicDialogProps {
  onSuccess?: () => void
}

export const CreateMnemonicDialog: React.FC<AppDialogProps<CreateMnemonicDialogProps>> = ({
  open,
  onClose,
  onSuccess,
}) => {
  useCloseIfNotConnected(onClose)
  const { adaptive } = useMediaMui()
  const [mnemonic, setMnemonic] = useState<string>()
  const { address } = useAccount()
  const seedProviderFactory = useSeedProviderFactory()

  return (
    <Modal
      closeButton
      open={open}
      css={{
        ...modalStyle,
      }}
      width={adaptive({
        sm: '400px',
        md: '650px',
        lg: '710px',
        defaultValue: '710px',
      })}
      onClose={onClose}
    >
      <ModalTitle>
        {' '}
        <FWIcon />
        {' '}
        {mnemonic ? 'FileWallet seed phrase' : 'Setup FileWallet password'}
      </ModalTitle>
      <CreatedMnemonicStyle>
        <div className="contentModalWindow">
          {mnemonic ? <ShowMnemonic mnemonic={mnemonic} />
            : (
              <CreatePasswordForm onSubmit={async ({ password }) => {
                if (address) {
                  const seedProvider = await seedProviderFactory.getSeedProvider(address)
                  const newMnemonic = createMnemonic()
                  const seed = Buffer.from(mnemonicToEntropy(newMnemonic), 'hex')
                  await seedProvider.set(seed, password)
                  setMnemonic(newMnemonic)
                  onSuccess?.()
                }
              }}
              />
            )}
        </div>
        {mnemonic && (
          <ModalButtonContainer>
            <ButtonGlowing
              whiteWithBlue
              modalButton
              modalButtonFontSize
              primary
              type="submit"
              onClick={onClose}
            >
              Got it
            </ButtonGlowing>
          </ModalButtonContainer>
        )}
      </CreatedMnemonicStyle>
    </Modal>
  )
}
