import { useWeb3Modal } from '@web3modal/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import { styled } from '../../../../styles'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useCanUnlock } from '../../../processing/SeedProvider/useCanUnlock'
import { FWIcon, Modal, ModalBody, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { CreateOrImportSection } from './sections/CreateOrImportSection'

const ConnectWalletWindowStyle = styled('div', {
  background: 'red',
  '& .nextui-backdrop-content': {
    maxWidth: 'inherit',
  },
})

type IConnectFileWalletDialog = AppDialogProps<{}> & {
  openWeb3Modal: () => void
}

export const ConnectFileWalletDialog = observer(({ open, onClose, openWeb3Modal }: IConnectFileWalletDialog) => {
  const { adaptive, smValue } = useMediaMui()
  const { isOpen } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const canUnlock = useCanUnlock(address)
  const { disconnect } = useDisconnect()

  return (
    <ConnectWalletWindowStyle>
      <Modal
        closeButton
        open={open && !isOpen && !canUnlock}
        width={adaptive({
          sm: '400px',
          md: '550px',
          lg: '743px',
          defaultValue: '743px',
        })}
        onClose={onClose}
        onCloseButtonClick={() => {
          isConnected && disconnect()
        }}
      >
        <ModalTitle style={{ fontSize: smValue ? '24px' : '32px', lineHeight: smValue ? '32px' : '40px', marginBottom: '32px' }}>
          <FWIcon />
          Log in / Sign up
        </ModalTitle>
        <ModalBody style={{ paddingBottom: '0', paddingTop: '0' }}>
          <CreateOrImportSection
            connectFunc={() => {
              openWeb3Modal?.()
            }}
            onSuccess={() => {
              onClose()
            }}
          />
        </ModalBody>
      </Modal>
    </ConnectWalletWindowStyle>
  )
})
