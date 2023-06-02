import { ComponentProps, useState } from 'react'
import * as React from 'react'

import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'
import { glow, Input, inputStyles } from '../../../UIkit/Form/Input'
import EyeImg from '../img/Eye.svg'
import EyeCloseImg from '../img/EyeClose.svg'

const PasswordInputStyle = styled('div', {
  ...inputStyles,
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  outline: '1px solid $gray600',
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  transition: 'outline-width 0.3s',
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '1px solid $blue500',
  },
  '&:focus': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
  '&:focus-within': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`,
  },
  position: 'relative',
  ...textVariant('primary1').true,
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '19px',
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
})

interface PasswordInputProps {
  inputProps: ComponentProps<typeof Input>
}

export default function PasswordInput(props: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  return (
    <PasswordInputStyle>
      <Input
        css={{
          paddingLR: 0,
          borderRadius: 0,
          border: 'none',
          flexGrow: 1,
          height: '100%',
          boxShadow: 'none',
          outline: 'none',
          '&:focus': {
            boxShadow: 'none',
            outline: 'none',
            animation: 'none',
          },
          '&:hover': {
            outline: 'none',
            boxShadow: 'none',
          },
        }}
        {...props.inputProps}
        isDisabledFocusStyle
        placeholder={'Start typing'}
        type={isPasswordVisible ? 'text' : 'password'}
      />
      <img src={isPasswordVisible ? EyeCloseImg : EyeImg} onClick={() => setIsPasswordVisible((value) => !value)} />
    </PasswordInputStyle>
  )
}
