import { useState } from 'react'
import * as React from 'react'
import { FieldValues } from 'react-hook-form'

import { styled } from '../../../../styles'
import { useStores } from '../../../hooks'
import { textVariant, Txt } from '../../../UIkit'
import { IInput, IInputControlled, Input } from '../../../UIkit/Form/Input'
import { EnterSeedPhraseDialog } from '../../Web3/EnterSeedPhraseDialog'
import EyeImg from '../img/Eye.svg'
import EyeCloseImg from '../img/EyeClose.svg'

const PasswordInputStyle = styled('div', {
  width: '100%',
  position: 'relative',
  '& img': {
    position: 'absolute',
    color: '$gray400',
    ...textVariant('primary1').true,
    fontWeight: '600',
    top: '11px',
    right: '12px',
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(120%)',
    },
  },
  '& .resetPassword span': {
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(110%)',
    },
  },
})

interface PasswordInputProps<T extends FieldValues> {
  inputProps: IInput
  controlledInputProps: IInputControlled<T>
  isCanReset?: boolean
}

export const PasswordInput = <T extends FieldValues>(props: PasswordInputProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const { dialogStore } = useStores()

  const openDialog = () => {
    dialogStore.openDialog({
      component: EnterSeedPhraseDialog,
      props: {
        isReset: true,
      },
    })
  }

  return (
    <PasswordInputStyle>
      <Input<T>
        {...props.inputProps}
        isDisabledFocusStyle
        controlledInputProps={props.controlledInputProps}
        placeholder={'Start typing'}
        type={isPasswordVisible ? 'text' : 'password'}
        style={{
          paddingRight: '48px',
        }}
      />
      {props.isCanReset && (
        <div className='resetPassword' style={{ width: '100%', textAlign: 'right', marginTop: '8px' }}>
          <Txt primary1 style={{ color: '#0090FF' }} onClick={() => { openDialog() }}>Reset password</Txt>
        </div>
      )}
      <img src={isPasswordVisible ? EyeCloseImg : EyeImg} onClick={() => setIsPasswordVisible((value) => !value)} />
    </PasswordInputStyle>
  )
}
