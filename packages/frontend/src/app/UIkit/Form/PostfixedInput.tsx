import { ComponentProps, ReactNode } from 'react'
import * as React from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../Txt'
import { inputStyles } from './Input'

const InputWithPrefix = styled('div', {
  ...inputStyles,
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  outline: '1px solid $gray300',
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  transition: 'outline-width 0.3s',
})

const InputPostfix = styled('div', {
  color: '$gray400',
  ...textVariant('primary1').true,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
})

const Input = styled('input', {
  ...inputStyles,
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
  '&:focus-within': {
    boxShadow: 'none',
    outline: 'none',
    animation: 'none',
  },
})

interface PrefixedInputProps {
  postfix?: ReactNode
  inputProps?: ComponentProps<typeof Input>
  postfixProps?: ComponentProps<typeof InputPostfix>
}

export default function PostfixedInput(props: PrefixedInputProps) {
  return (
    <InputWithPrefix isDisabledFocusStyle withoutDefaultBorder>
      <Input
        isDisabledFocusStyle
        {...props.inputProps}
      />
      <InputPostfix {...props.postfixProps}>{props.postfix}</InputPostfix>
    </InputWithPrefix>
  )
}
