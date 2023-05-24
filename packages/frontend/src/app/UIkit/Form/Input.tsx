import { styled } from '../../../styles'
import { textVariant } from '../Txt'

export const inputStyles = {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  outline: 'none',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  '&:placeholder': {
    color: '$gray400'
  },
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    border: '1px solid #38BCC9'
  },
  '&:focus': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    border: '3px solid #38BCC9'
  },
  width: '100%',
  variants: {
    isError: {
      true: {
        borderColor: '$red'
      },
      false: {
        borderColor: '$black'
      }
    },
    isDisabledFocusStyle: {
      true: {
        '&:focus': {
          boxShadow: 'none',
          border: 'none'
        }
      }
    }
  }
}

export const Input = styled('input', {
  ...inputStyles,
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button,': {
    appearance: 'none'
  }
})
