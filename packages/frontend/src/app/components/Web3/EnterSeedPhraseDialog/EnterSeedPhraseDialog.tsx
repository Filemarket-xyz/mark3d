import React, { useState } from 'react'
import { Modal } from '@nextui-org/react'
import { AppDialogProps } from '../../../utils/dialog'
import { styled } from '../../../../styles'
import { ModalTitle } from '../../Modal/Modal'
import { Txt } from '../../../UIkit'
import { EnterSeedPhraseForm } from './EnterSeedPhraseForm/EnterSeedPhraseForm'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useAccount, useDisconnect } from 'wagmi'
import { mnemonicToSeed } from 'bip39'
import { useCloseIfNotConnected } from '../../../hooks/useCloseIfNotConnected'
import { useSeedProvider } from '../../../processing'
import {useStores} from "../../../hooks";

const ModalStyle = styled(Modal, {
  fontSize: '20px'
})

const InputWindowStyle = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',

  '& button': {
    padding: '5px',
    marginTop: '20px',
    color: 'white'
  },
  '& .contentModalWindow': {
    width: '100%'
  },

  '& .closeButton': {
    top: '-35px !important'
  },
  paddingBottom: '30px'
})

export function EnterSeedPhraseDialog({ open, onClose }: AppDialogProps<{}>): JSX.Element {
  useCloseIfNotConnected(onClose)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { adaptive } = useMediaMui()
  const { dialogStore } = useStores()
  const { address } = useAccount()
  const { seedProvider } = useSeedProvider(address)
  return (
    <ModalStyle
      closeButton
      open={open}
      onClose={() => {
        onClose()
      }}
      width={adaptive({
        sm: '400px',
        md: '650px',
        lg: '950px',
        defaultValue: '950px'
      })}
    >
      <ModalTitle>{seedProvider?.mnemonic ? 'Enter a new seed-phrase' : 'Enter a seed-phrase'}</ModalTitle>
      <InputWindowStyle>
        <div className="contentModalWindow">
          {!isSuccess
            ? <EnterSeedPhraseForm
              onSubmit={async (value) => {
                const seed = await mnemonicToSeed(value.seedPhrase)
                await seedProvider?.set(seed, value.password, value.seedPhrase)
                setIsSuccess(true)
                onClose()
                dialogStore.closeDialogByName('ConnectMain')
              }
              }/>
            : <Txt h2>{'SUCCESS!'}</Txt>
          }
        </div>
      </InputWindowStyle>
    </ModalStyle>
  )
}
