import { keyframes, styled } from '../../../styles'
import { textVariant } from '../Txt'

export const glow = keyframes({
  '0%': {
    outline: '#38BCC9',
    boxShadow: '0px 0px 10px rgba(2, 143, 255, 0.5)'
  },
  '100%': {
    outline: '#088DFA',
    boxShadow: '0px 0px 15px #028FFF'
  }
})

export const inputStyles = {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: 48,
  paddingLR: '$3',
  outline: '1px solid $gray300',
  ...textVariant('secondary1').true,
  color: '$blue900',
  border: '2px solid transparent',
  boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
  transition: 'outline-width 0.5s',
  '&:placeholder': {
    color: '#656668'
  },
  '&:hover': {
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '1px solid #38BCC9'
  },
  '&:focus': {
    transition: 'outline-width 0.1s',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)',
    outline: '3px solid #38BCC9',
    animation: `${glow} 800ms ease-out infinite alternate`
  },
  width: '100%',
  variants: {
    isError: {
      true: {
        borderColor: '$red'
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
