import { Modal } from '@nextui-org/react'
import { ModalTitle } from '../../Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { styled } from '../../../../styles'
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { CreateOrImportSection } from './sections/CreateOrImportSection'
import { useAccount } from 'wagmi'
import { UnlockSection } from './sections/UnlockSection'
import { useCanUnlock } from '../../../processing/SeedProvider/useCanUnlock'

const ConnectWalletWindowStyle = styled('div', {
  background: 'red',
  '& .nextui-backdrop-content': {
    maxWidth: 'inherit'
  }
})

export const ConnectFileWalletDialog = observer(({ open, onClose }: AppDialogProps<{}>) => {
  useCloseIfNotConnected(onClose)
  const { adaptive } = useMediaMui()
  const { address } = useAccount()
  const canUnlock = useCanUnlock(address)
  return (
    <ConnectWalletWindowStyle>
      <Modal
        closeButton
        open={open}
        onClose={onClose}
        width={adaptive({
          sm: canUnlock ? '300px' : '400px',
          md: canUnlock ? '300px' : '650px',
          lg: canUnlock ? '400px' : '950px',
          defaultValue: canUnlock ? '500px' : '950px'
        })}
      >
        <ModalTitle>Connect Files Wallet</ModalTitle>
        <Modal.Body>
          {canUnlock ? (<UnlockSection/>) : (<CreateOrImportSection/>)}
        </Modal.Body>
      </Modal>
    </ConnectWalletWindowStyle>
  )
})
