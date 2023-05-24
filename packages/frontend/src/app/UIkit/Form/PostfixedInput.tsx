import { ComponentProps, ReactNode } from 'react'
import * as React from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../Txt'
import { Input, inputStyles } from './Input'

const InputWithPrefix = styled('div', {
  ...inputStyles,
  '&:focus-within': inputStyles['&:focus'],
  width: '100%',
  display: 'flex',
  gap: '$2',
  alignItems: 'center'
})

const InputPostfix = styled('div', {
  color: '$gray400',
  ...textVariant('primary1').true,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center'
})

interface IPostfixProps {
  onPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

interface PrefixedInputProps {
  postfix: ReactNode
  placeholder: string
  inputProps?: ComponentProps<typeof Input>
  postfixProps?: IPostfixProps
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
          '&:focus': {
            boxShadow: 'none'
          }
        }}
        {...props.inputProps}
        placeholder={props.placeholder}
      />
      <InputPostfix {...props.postfixProps}>{props.postfix}</InputPostfix>
    </InputWithPrefix>
  )
}
