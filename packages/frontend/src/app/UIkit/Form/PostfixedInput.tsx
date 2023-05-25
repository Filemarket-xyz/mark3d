import { ComponentProps, ReactNode } from 'react'
import * as React from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../Txt'
import { glow, Input, inputStyles } from './Input'

const InputWithPrefix = styled('div', {
  ...inputStyles,
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  outline: '1px solid $gray300',
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  transition: 'outline-width 0.3s',
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '1px solid #38BCC9'
  },
  '&:focus': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`
  },
  '&:focus-within': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`
  }
})

const InputPostfix = styled('div', {
  color: '$gray400',
  ...textVariant('primary1').true,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center'
})

interface PrefixedInputProps {
  postfix: ReactNode
  placeholder: string
  inputProps?: ComponentProps<typeof Input>
  postfixProps?: ComponentProps<typeof InputPostfix>
}

export default function PostfixedInput(props: PrefixedInputProps) {
  return (
    <InputWithPrefix>
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
            animation: 'none'
          },
          '&:hover': {
            outline: 'none',
            boxShadow: 'none'
          }
        }}
        {...props.inputProps}
        isDisabledFocusStyle
        placeholder={props.placeholder}
      />
      <InputPostfix {...props.postfixProps}>{props.postfix}</InputPostfix>
    </InputWithPrefix>
  )
}
