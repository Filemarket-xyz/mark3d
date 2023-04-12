import { useTextField, AriaTextFieldOptions } from 'react-aria'
import React from 'react'
import { styled } from '../../../styles'

const InputStyle = styled('div', {
  position: 'relative',
  width: '100%',

  '& input': {
    fontSize: '$h5',
    fontWeight: '$h',
    lineHeight: '$h5',
    width: '100%',
    height: '100%',
    background: '$blue300',
    border: '2px solid $white50',
    borderRadius: '6px',
    textAlign: 'center',
    color: '$white100'
  },

  '& input::-webkit-input-placeholder': {
    fontFamily: 'Nunito',
    fontWeight: 500,
    fontSize: '$h3',
    lineHeight: '16px',
    color: '$white75',
    textShadow: '0px 2px 4px rgba(112, 112, 112, 0.25)',
    textAlign: 'left'
  },

  '& .errorInput': {
    border: '2px solid $red'
  },

  '& .errorMessage': {
    color: '$red'
  }
})

export const Input = (props: AriaTextFieldOptions<'input'>) => {
  const { label } = props
  const ref = React.useRef<HTMLInputElement>(null)
  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
        useTextField(props, ref)
  return (
        <InputStyle>
            <label {...labelProps}>{label}</label>
            <input {...inputProps} ref={ref} className={`${inputProps['aria-invalid'] ? 'errorInput' : ''}`} />
            {props.description && (
                <div {...descriptionProps}>
                    {props.description}
                </div>
            )}
            {props.errorMessage &&
                (
                    <div {...errorMessageProps} className={'errorMessage'}>
                        {props.errorMessage}
                    </div>
                )}
        </InputStyle>
  )
}
