import { styled } from '../../../styles'
import { textVariant } from '../Txt'

// const glow = keyframes({
//   '0%': {
//     borderColor: '#393',
//     boxShadow: '0 0 5px rgba(0,255,0,.2), inset 0 0 5px rgba(0,255,0,.1), 0 2px 0 #000'
//   },
//   '100%': {
//     borderColor: '#6f6',
//     boxShadow: '0 0 20px rgba(0,255,0,.6), inset 0 0 10px rgba(0,255,0,.4), 0 2px 0 #000'
//   }
// })

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
    outline: '3px solid #38BCC9'
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
