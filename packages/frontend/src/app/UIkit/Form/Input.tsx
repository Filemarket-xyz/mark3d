import { ComponentProps } from '@stitches/react'
import React from 'react'
import {
  Control,
  Controller, FieldValues, Path,
} from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

import { keyframes, styled } from '../../../styles'
import { textVariant, Txt } from '../Txt'

export const glow = keyframes({
  '0%': {
    outline: '#38BCC9',
    boxShadow: '0px 0px 10px rgba(2, 143, 255, 0.5)',
  },
  '100%': {
    outline: '#088DFA',
    boxShadow: '0px 0px 15px #028FFF',
  },
})

export const inputStyles = {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  outline: '1px solid $gray600',
  ...textVariant('primary1').true,
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '19px',
  color: '$blue900',
  border: '2px solid transparent',
  transition: 'outline-width 0.5s',

  '&:placeholder': {
    color: '#656668',
    ...textVariant('primary1').true,
    fontWeight: '400',
  },
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
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button,': {
    appearance: 'none',
  },
  width: '100%',
  variants: {
    isError: {
      true: {
        outlineColor: '$red',
      },
    },
    isDisabledFocusStyle: {
      true: {
        '&:focus': {
          boxShadow: 'none',
          border: 'none',
        },
      },
    },
    withoutDefaultBorder: {
      true: {
        outline: 'none',
      },
    },
  },
}

const InputStyled = styled('input', {
  ...inputStyles,
})

const InputStyleContainer = styled('div', {
  width: '100%',
})

const ErrorMessage = styled('div', {
  textAlign: 'left',
  padding: '24px 16px 12px',
  background: 'rgba(197, 75, 92, 0.05)',
  border: '1px solid rgba(197, 75, 92, 0.25)',
  borderRadius: '0px 0px 16px 16px',
  marginTop: '-12px',
  color: '$red500',
})

export interface IInputControlled<T extends FieldValues> {
  control: Control<T, any>
  name: Path<T>
  placeholder?: string
  rules?: RegisterOptions
}

export type IInput = ComponentProps<typeof InputStyleContainer> & ComponentProps<typeof InputStyled> & {
  errorMessage?: string
}

export type IInputControl<T extends FieldValues> = IInput & {
  errorMessage?: string
  controlledInputProps: IInputControlled<T>
}

export const Input = <T extends FieldValues>(
  props: IInputControl<T>,
) => {
  const { errorMessage, controlledInputProps, ...inputProps } = props

  return (
    <Controller
      control={controlledInputProps?.control}
      name={controlledInputProps?.name}
      rules={controlledInputProps?.rules}
      render={({ field }) => (
        <InputStyleContainer>
          <InputStyled
            {...inputProps}
            {...field}
          />
          {(props.errorMessage && props.isError) &&
              (
                <ErrorMessage>
                  <Txt primary1>{props.errorMessage}</Txt>
                </ErrorMessage>
              )}
        </InputStyleContainer>
      )}
    />
  )
}
