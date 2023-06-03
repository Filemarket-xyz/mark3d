import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import GreenCheckBoxIcon from '../../../../../assets/img/CheckBoxGreenIcon.svg'
import { styled } from '../../../../../styles'
import { useStores } from '../../../../hooks'
import { useMediaMui } from '../../../../hooks/useMediaMui'
import { Button, ButtonGlowing, textVariant, Txt } from '../../../../UIkit'
import { ModalBanner, ModalButtonContainer } from '../../../../UIkit/Modal/Modal'
import { CreateMnemonicDialog } from '../../CreateMnemonicDialog'
import { EnterSeedPhraseDialog } from '../../EnterSeedPhraseDialog'

const ConnectWalletWindowContentStyle = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  '@md': {
    gap: '20px',
  },
})

const StepBlock = styled('div', {
  width: '100%',
  height: '160px',
  border: '2px solid #0090FF',
  borderRadius: '16px',
  display: 'grid',
  gridTemplateRows: '64px auto',
  '@md': {
    height: 'max-content',
  },
  '@sm': {
    gridTemplateRows: '48px auto',
  },
})

const StepBlockHeader = styled('div', {
  ...textVariant('primary1').true,
  fontSize: '32px',
  lineHeight: '40px',
  width: '100%',
  background: '#0090FF',
  justifyContent: 'center',
  borderRadius: '12px 12px 0 0',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  '@sm': {
    fontSize: '24px',
  },
})

const StepBlockMain = styled('div', {
  width: '100%',
  padding: '24px 32px',
  gap: '32px',
  display: 'flex',
  alignItems: 'center',
  '& .mainBlock': {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '20px',
  },
  '@md': {
    gap: '20px',
    '& .mainBlock': {
      gap: '12px',
    },
  },
  '@sm': {
    gap: '18px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
})

const Line = styled('div', {
  height: '116px',
  width: '2px',
  background: '#0090FF',
  '@md': {
    width: '106%',
    height: '2px',
  },
  '@sm': {
    width: '111%',
  },
})

const CheckBox = styled('div', {
  width: '32px',
  height: '32px',
  background: 'white',
  borderRadius: '50%',
  right: '32px',
  position: 'absolute',
  variants: {
    isChecked: {
      true: {
        outline: '2px solid #04E762',
        boxShadow: 'inset 0px 0px 5px #04E762',
        '&:after': {
          content: `url(${GreenCheckBoxIcon})`,
          top: '-4px',
          left: '5px',
          position: 'absolute',
        },
        '@sm': {
          '&:after': {
            top: '-2px',
          },
        },
      },
    },
  },
  '@sm': {
    right: '16px',
  },
})

export const CreateOrImportSection: FC<{ onSuccess?: () => void, connectFunc?: () => void }> = observer(({ onSuccess, connectFunc }) => {
  const { dialogStore } = useStores()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { mdValue, smValue } = useMediaMui()
  const openImportAccountDialog = () => {
    dialogStore.openDialog({
      component: EnterSeedPhraseDialog,
      props: {},
    })
  }

  const openCreatedMnemonicDialog = () => {
    dialogStore.openDialog({
      component: CreateMnemonicDialog,
      props: {
        onSuccess,
      },
    })
  }

  return (
    <ConnectWalletWindowContentStyle>
      <StepBlock>
        <StepBlockHeader>
          <CheckBox isChecked={isConnected} />
          Step 1
        </StepBlockHeader>
        <StepBlockMain>
          <ModalButtonContainer style={{ width: '100%', marginTop: 0, justifyContent: 'center' }}>
            {!isConnected ? (
              <ButtonGlowing
                whiteWithBlue
                modalButton
                modalButtonFontSize
                style={{ width: mdValue ? (smValue ? '260px' : '414px') : '608px' }}
                onClick={() => {
                  connectFunc?.()
                }}
              >
                Connect wallet
              </ButtonGlowing>
            )
              : (
                <Button
                  disconnect
                  style={{
                    width: mdValue ? (smValue ? '260px' : '414px') : '608px',
                  }}
                  onClick={() => {
                    disconnect()
                  }}
                >
                  Disconnect wallet
                </Button>
              )}
          </ModalButtonContainer>
        </StepBlockMain>
      </StepBlock>
      <StepBlock style={{ height: mdValue ? 'max-content' : '220px' }}>
        <StepBlockHeader>
          Step 2
        </StepBlockHeader>
        <StepBlockMain style={{ flexDirection: mdValue ? 'column' : 'row', paddingTop: mdValue ? '16px' : '0', paddingBottom: mdValue ? '16px' : '0' }}>
          <div className='mainBlock'>
            <Txt primary1 style={{ fontWeight: '500', fontSize: mdValue ? '16px' : '16px' }}>
              If you are
              {' '}
              <span style={{ fontWeight: '700' }}>NEW</span>
            </Txt>
            <ModalButtonContainer style={{ width: '100%', marginTop: 0, justifyContent: 'center' }}>
              <ButtonGlowing
                whiteWithBlue
                modalButton
                modalButtonFontSize
                disabled={!isConnected}
                isDisabled={!isConnected}
                style={{ width: mdValue ? (smValue ? '260px' : '414px') : '272px' }}
                onClick={() => {
                  openCreatedMnemonicDialog()
                }}
              >
                Create FileWallet
              </ButtonGlowing>
            </ModalButtonContainer>
          </div>
          <Line />
          <div className='mainBlock'>
            <Txt primary1 style={{ fontWeight: '500', fontSize: mdValue ? '16px' : '16px' }}>
              If you
              {' '}
              <span style={{ fontWeight: '700' }}>HAVE CREATED</span>
              {' '}
              FileWallet
            </Txt>
            <ModalButtonContainer style={{ width: '100%', marginTop: 0, justifyContent: 'center' }}>
              <ButtonGlowing
                whiteWithBlue
                modalButton
                modalButtonFontSize
                disabled={!isConnected}
                isDisabled={!isConnected}
                style={{ width: mdValue ? (smValue ? '260px' : '414px') : '272px' }}
                onClick={() => {
                  openImportAccountDialog()
                }}
              >
                Connect FileWallet
              </ButtonGlowing>
            </ModalButtonContainer>
          </div>
        </StepBlockMain>
      </StepBlock>
      <ModalBanner style={{ marginTop: '0' }}>
        <Txt primary1 style={{ fontSize: '20px', lineHeight: '24px' }}>What is FileWallet?</Txt>
        <Txt primary1 style={{ fontWeight: '400', lineHeight: '24px' }}>
          Each file hidden inside an NFT using EFT© Protocol is encrypted
          with a special cryptographic key. This key belongs only to the EFT owner,
          providing reliable protection against unauthorized content downloading.
          FileWallet stores all these keys so you can decrypt and download all
          your files from any device.
        </Txt>
      </ModalBanner>
    </ConnectWalletWindowContentStyle>
  )
})
