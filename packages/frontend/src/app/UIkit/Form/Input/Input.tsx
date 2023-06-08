import { ComponentProps } from '@stitches/react'
import React from 'react'
import {
  Control,
  Controller, FieldValues, Path,
} from 'react-hook-form'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'

import { Txt } from '../../Txt'
import { StyledAfterContainer, StyledErrorMessage, StyledInput, StyledInputContainer } from './Input.styles'

export interface ControlledInputProps<T extends FieldValues> {
  control: Control<T, any>
  name: Path<T>
  placeholder?: string
  rules?: RegisterOptions
}

export type InputProps = ComponentProps<typeof StyledInputContainer> & ComponentProps<typeof StyledInput> & {
  errorMessage?: string
}

export type InputControlProps<T extends FieldValues> = InputProps & {
  errorMessage?: string
  controlledInputProps: ControlledInputProps<T>
  after?: string
}

export const Input = <T extends FieldValues>({
  after,
  errorMessage,
  controlledInputProps,
  ...inputProps
}: InputControlProps<T>) => {
  return (
    <Controller
      control={controlledInputProps?.control}
      name={controlledInputProps?.name}
      rules={controlledInputProps?.rules}
      render={({ field }) => (
        <StyledInputContainer>
          <StyledInput
            {...inputProps}
            {...field}
          />
          {after && (
            <StyledAfterContainer>
              {after}
            </StyledAfterContainer>
          )}
          {(errorMessage && inputProps.isError) && (
            <StyledErrorMessage>
              <Txt primary1>{errorMessage}</Txt>
            </StyledErrorMessage>
          )}
        </StyledInputContainer>
      )}
    />
  )
}
