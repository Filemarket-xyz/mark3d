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

export const CreateOrImportSection: FC<{ onSuccess?: () => void }> = observer(({ onSuccess }) => {
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
      props: {
        onSuccess
      }
    })
  }
  return (
    <ConnectWalletWindowContentStyle>
      <div className="headText">
        <Txt body2>FileWallet will store encryption keys to your files</Txt>
      </div>
      <div className="mainContent">
        <div className="section">
          <ToolCardConnectWallet>
            <ToolCardContentWallet>
              <ToolCardInfo>
                <ToolTitle style={{ textAlign: 'center' }}>Create FileWallet</ToolTitle>
                <ToolDescription style={{ textAlign: 'center' }}>
                  Click here, if you are new to FileMarket.xyz
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
                <ToolTitle style={{ textAlign: 'center' }}>Connect FileWallet</ToolTitle>
                <ToolDescription style={{ textAlign: 'center' }}>
                  Click here, if you have already used FileMarket.xyz on a different device
                </ToolDescription>
              </ToolCardInfo>
              <Button onClick={() => {
                openImportAccountDialog()
              }}>
                Connect
              </Button>
            </ToolCardContentWallet>
          </ToolCardConnectWallet>
        </div>
      </div>
    </ConnectWalletWindowContentStyle>
  )
})
