import React, {ReactNode, useState} from 'react'
import { Modal } from '@nextui-org/react'
import {AppDialogProps} from "../../../utils/dialog";
import { styled } from '../../../../styles'
import {ModalTitle} from "../../Modal/Modal";
import {Button, Txt} from "../../../UIkit";
import {Input} from "../../../UIkit/Input";

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
  '& input': {
    padding: '2px',
    marginTop: '8px',
      height: '50px !important',
      width: '82% !important',
      background: 'none !important',
      border: '2px solid $blue300'
  },

  '& .closeButton': {
    top: '-35px !important'
  },
    paddingBottom: '30px'
})

type InputWindowProps = AppDialogProps<{
  onPressButton: (value: string) => Promise<any>
  textContent: ReactNode
  validateFunc?: (value: string) => 'valid' | 'invalid'
    buttonText: ReactNode
    onCloseCallback?: () => void
}>

export function InputWindow({ open, onClose, onPressButton, textContent, validateFunc, onCloseCallback, buttonText }: InputWindowProps): JSX.Element {
  const [valueInput, setValueInput] = useState<string>('')
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
          <ModalTitle>Введите seed-фразу</ModalTitle>
          <Modal.Body>

          </Modal.Body>
                            <InputWindowStyle>
                                <div className="contentModalWindow">
                                    {!isSuccess
                                      ? <>
                                            {textContent}
                                    <Input onChange={(value: string) => { setValueInput(value) }} validationState={validateFunc?.(valueInput)} errorMessage={<Txt h5>{validateFunc?.(valueInput)}</Txt>}/>
                                            <Button input={'true'} isDisabled={validateFunc?.(valueInput) !== 'valid'} onClick={() => { onPressButton(valueInput).then(() => setSuccess(true)).catch((e) => console.log(e)) }}><Txt h3>{buttonText}</Txt></Button></>
                                      : <Txt h2>{'SUCCESS!'}</Txt>
                                    }
                                </div>
                            </InputWindowStyle>
      </Modal>
  )
}
