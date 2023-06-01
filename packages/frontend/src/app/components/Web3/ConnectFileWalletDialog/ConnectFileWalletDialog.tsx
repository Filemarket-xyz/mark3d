import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAccount } from 'wagmi'

import { styled } from '../../../../styles'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useCanUnlock } from '../../../processing/SeedProvider/useCanUnlock'
import { Txt } from '../../../UIkit'
import { FWIcon, Modal, ModalBody, ModalTitle } from '../../../UIkit/Modal/Modal'
import { AppDialogProps } from '../../../utils/dialog'
import { CreateOrImportSection } from './sections/CreateOrImportSection'
import { UnlockSection } from './sections/UnlockSection'

const ConnectWalletWindowStyle = styled('div', {
  background: 'red',
  '& .nextui-backdrop-content': {
    maxWidth: 'inherit',
  },
})

export const ConnectFileWalletDialog = observer(({ open, onClose }: AppDialogProps<{}>) => {
  useCloseIfNotConnected(onClose)
  const { adaptive } = useMediaMui()
  const { address } = useAccount()
  const canUnlock = useCanUnlock(address)

  return (
    <ConnectWalletWindowStyle>
      <Modal
        preventClose
        open={open}
        width={adaptive({
          sm: '400px',
          md: '650px',
          lg: '664px',
          defaultValue: '664px',
        })}
        onClose={onClose}
      >
        <ModalTitle style={{ marginBottom: '0' }}>
          {' '}
          <FWIcon />
          {' '}
          <Txt h4>Connect FileWallet</Txt>
        </ModalTitle>
        <ModalBody style={{ paddingBottom: canUnlock ? 0 : '40px' }}>
          {canUnlock ? (
            <UnlockSection onSuccess={() => {
              onClose()
            }}
            />
          ) : (
            <CreateOrImportSection onSuccess={() => {
              onClose()
            }}
            />
          )}
        </ModalBody>
      </Modal>
    </ConnectWalletWindowStyle>
  )
})
