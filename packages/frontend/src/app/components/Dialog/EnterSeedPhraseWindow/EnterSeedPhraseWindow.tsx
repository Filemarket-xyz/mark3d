import React, {ReactNode, useState} from 'react'
import { Modal } from '@nextui-org/react'
import {AppDialogProps} from "../../../utils/dialog";
import { styled } from '../../../../styles'
import {ModalTitle} from "../../Modal/Modal";
import {Button, Txt} from "../../../UIkit";
import {Input} from "../../../UIkit/Form/Input";
import {EnterSeedPhraseForm, EnterSeedPhraseValue} from "./EnterSeedPhraseForm/EnterSeedPhraseForm";

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

type InputWindowProps = AppDialogProps<{
  onPressButton: (value: EnterSeedPhraseValue) => Promise<any>
    onCloseCallback?: () => void
}>

export function EnterSeedPhraseWindow({ open, onClose, onPressButton, onCloseCallback }: InputWindowProps): JSX.Element {
  const [isSuccess, setSuccess] = useState<boolean>(false)
  return (
      <Modal
          closeButton
          open={open}
          onClose={() => {
              onCloseCallback?.()
              onClose()
          }}
          width={'inherit'}
      >
          <ModalTitle>Enter a seed-фразу</ModalTitle>
                            <InputWindowStyle>
                                <div className="contentModalWindow">
                                    {!isSuccess
                                      ? <EnterSeedPhraseForm
                                            onSubmit={(value) => {
                                                onPressButton(value)
                                                    .then(() => setSuccess(true))
                                                    .catch((e) => console.log(e))
                                            }
                                      }/>
                                      : <Txt h2>{'SUCCESS!'}</Txt>
                                    }
                                </div>
                            </InputWindowStyle>
      </Modal>
  )
}
