import { Modal } from '@nextui-org/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useCanUnlock } from '../../../processing/SeedProvider/useCanUnlock'
import { Txt } from '../../../UIkit'
import { AppDialogProps } from '../../../utils/dialog'
import { ModalTitle } from '../../Modal/Modal'
import { CreateOrImportSection } from './sections/CreateOrImportSection'
import { UnlockSection } from './sections/UnlockSection'

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
        preventClose={true}
        width={adaptive({
          sm: canUnlock ? '300px' : '400px',
          md: canUnlock ? '300px' : '650px',
          lg: canUnlock ? '400px' : '950px',
          defaultValue: canUnlock ? '500px' : '950px'
        })}
      >
        <ModalTitle><Txt h4>Connect FileWallet</Txt></ModalTitle>
        <Modal.Body>
          {canUnlock ? (<UnlockSection onSuccess={() => {
            onClose()
          }} />) : (<CreateOrImportSection onSuccess={() => {
            onClose()
          }} />)}
        </Modal.Body>
      </Modal>
    </ConnectWalletWindowStyle>
  )
})
