import { mnemonicToEntropy } from 'bip39'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { useStores } from '../../../hooks'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useStatusModal } from '../../../hooks/useStatusModal'
import { useSeedProvider } from '../../../processing'
import { FWIcon, Modal, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import MintModal from '../../Modal/Modal'
import { EnterSeedPhraseForm } from './EnterSeedPhraseForm/EnterSeedPhraseForm'

const InputWindowStyle = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
})

export function EnterSeedPhraseDialog({ open, onClose, isReset }: AppDialogProps<{ isReset?: boolean }>): JSX.Element {
  useCloseIfNotConnected(onClose)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { adaptive } = useMediaMui()
  const { dialogStore } = useStores()
  const { address } = useAccount()
  const { seedProvider } = useSeedProvider(address)

  const { modalProps } = useStatusModal({
    statuses: { result: isSuccess, isLoading: false, error: undefined },
    okMsg: isReset ? 'FileWallet password successfully changed' : 'FileWallet successfully connected!',
    loadingMsg: '',
  })

  return (
    <>
      {!isSuccess ? (
        <Modal
          closeButton
          open={open}
          width={adaptive({
            sm: '400px',
            md: '550px',
            lg: '710px',
            defaultValue: '710px',
          })}
          onClose={() => {
            onClose()
          }}
        >
          <ModalTitle style={{ marginBottom: '40px' }}>
            <FWIcon />
            {' '}
            {isReset ? 'Reset password' : 'Connect FileWallet'}
          </ModalTitle>
          <InputWindowStyle>
            <EnterSeedPhraseForm
              isReset={isReset}
              onSubmit={async (value) => {
                const seed = mnemonicToEntropy(value.seedPhrase)
                await seedProvider?.set(Buffer.from(seed, 'hex'), value.password)
                setIsSuccess(true)
                dialogStore.closeDialogByName('ConnectMain')
              }
              }
            />
          </InputWindowStyle>
        </Modal>
      )
        : <MintModal {...modalProps} />
      }
    </>
  )
}
