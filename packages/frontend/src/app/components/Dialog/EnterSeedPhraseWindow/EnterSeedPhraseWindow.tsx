import React, { useState } from 'react'
import { Modal } from '@nextui-org/react'
import { AppDialogProps } from '../../../utils/dialog'
import { styled } from '../../../../styles'
import { ModalTitle } from '../../Modal/Modal'
import { Txt } from '../../../UIkit'
import { EnterSeedPhraseForm } from './EnterSeedPhraseForm/EnterSeedPhraseForm'
import { onImportAccountButtonHandle } from '../ConnectWalletWindow/utils/functions'
import { useMediaMui } from '../../../hooks/useMediaMui'
import { useDisconnectAndLogout } from '../../../hooks/useDisconnectAndLogout'

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

export function EnterSeedPhraseWindow({ open, onClose }: AppDialogProps<{}>): JSX.Element {
  const [isSuccess, setSuccess] = useState<boolean>(false)
  const { adaptive } = useMediaMui()
  const { disconnect } = useDisconnectAndLogout()
  return (
      <ModalStyle
          closeButton
          open={open}
          onClose={() => {
            disconnect()
            onClose()
          }}
          width={adaptive({
            sm: '400px',
            md: '650px',
            lg: '950px',
            defaultValue: 'inherit'
          })}
      >
          <ModalTitle>Enter a seed-phrase</ModalTitle>
                            <InputWindowStyle>
                                <div className="contentModalWindow">
                                    {!isSuccess
                                      ? <EnterSeedPhraseForm
                                            onSubmit={(value) => {
                                              onImportAccountButtonHandle(value)
                                                .then(() => setSuccess(true))
                                                .catch((e) => console.log(e))
                                            }
                                      }/>
                                      : <Txt h2>{'SUCCESS!'}</Txt>
                                    }
                                </div>
                            </InputWindowStyle>
      </ModalStyle>
  )
}
