import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { useStores } from '../../../../hooks'
import {
  ToolCardContent,
  ToolCardInfo,
  ToolDescription,
  ToolTitle
} from '../../../../pages/MainPage/Blocks/WelcomeBlock'
import { Button, ToolCard, Txt } from '../../../../UIkit'
import { CreateMnemonicDialog } from '../../CreateMnemonicDialog'
import { EnterSeedPhraseDialog } from '../../EnterSeedPhraseDialog'

const ConnectWalletWindowContentStyle = styled('div', {
  fontSize: '12px',
  '& .headText': {
    textAlign: 'center',
    paddingBottom: '1em'
  },
  '& .mainContent': {
    display: 'flex',
    '& svg': {
      width: '8.33em',
      height: '8.33em'
    },
    justifyContent: 'center',
    gap: '1em',
    '& button': {
      background: 'white'
    }
  },
  paddingBottom: '2em',
  '@md': {
    fontSize: '10px'
  },
  '@sm': {
    '& .mainContent': {
      fontSize: '8px',
      flexDirection: 'column'
    }
  }
})

const ToolCardConnectWallet = styled(ToolCard, {
  width: '29em',
  '@sm': {
    width: '100%'
  }
})

const ToolCardContentWallet = styled(ToolCardContent, {
  '@sm': {
    minHeight: '250px'
  }
})

export const CreateOrImportSection: FC = observer(() => {
  const { dialogStore } = useStores()
  const openImportAccountDialog = () => {
    dialogStore.openDialog({
      component: EnterSeedPhraseDialog,
      props: {}
    })
  }

  const openCreatedMnemonicDialog = () => {
    dialogStore.openDialog({
      component: CreateMnemonicDialog,
      props: {}
    })
  }
  return (
    <ConnectWalletWindowContentStyle>
      <div className="headText">
        <Txt h3>Create or Import Account</Txt>
      </div>
      <div className="mainContent">
        <div className="section">
          <ToolCardConnectWallet>
            <ToolCardContentWallet>
              <ToolCardInfo>
                <ToolTitle style={{ textAlign: 'center' }}>Create Account</ToolTitle>
                <ToolDescription style={{ textAlign: 'center' }}>
                  Create a new account
                </ToolDescription>
              </ToolCardInfo>
              <Button onClick={() => {
                openCreatedMnemonicDialog()
              }}>
                Create
              </Button>
            </ToolCardContentWallet>
          </ToolCardConnectWallet>
        </div>
        <div className="section">
          <ToolCardConnectWallet>
            <ToolCardContentWallet>
              <ToolCardInfo>
                <ToolTitle style={{ textAlign: 'center' }}>Import Account</ToolTitle>
                <ToolDescription style={{ textAlign: 'center' }}>
                  Import your account using the seed phrase
                  received during registration
                </ToolDescription>
              </ToolCardInfo>
              <Button onClick={() => {
                openImportAccountDialog()
              }}>
                Import
              </Button>
            </ToolCardContentWallet>
          </ToolCardConnectWallet>
        </div>
      </div>
    </ConnectWalletWindowContentStyle>
  )
})
