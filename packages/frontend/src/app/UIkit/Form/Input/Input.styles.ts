import { keyframes, styled } from '../../../../styles'
import { textVariant } from '../../Txt'

export const glow = keyframes({
  '0%': {
    outline: '1px solid rgba(56, 188, 201, 0.7);',
    boxShadow: '0px 0px 10px rgba(2, 143, 255, 0.5)',
  },
  '100%': {
    outline: '1px solid rgba(8, 141, 250, 0.7);',
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

export const StyledInput = styled('input', {
  ...inputStyles,
})

export const StyledInputContainer = styled('div', {
  position: 'relative',
  width: '100%',
})

export const StyledErrorMessage = styled('div', {
  textAlign: 'left',
  padding: '24px 16px 12px',
  background: 'rgba(197, 75, 92, 0.05)',
  border: '1px solid rgba(197, 75, 92, 0.25)',
  borderRadius: '0px 0px 16px 16px',
  marginTop: '-12px',
  color: '$red500',
})

export const StyledAfterWrapper = styled('div', {
  position: 'absolute',
})
