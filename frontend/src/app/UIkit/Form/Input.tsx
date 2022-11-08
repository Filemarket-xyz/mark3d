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
  '&:focus': {
    background:
      'linear-gradient($white 0 0) padding-box, linear-gradient(to right, #00DCFF80, #E14BEC80) border-box',
    boxShadow: '0px 2px 15px rgba(19, 19, 45, 0.2)'
  },
  width: '100%'
}

export const Input = styled('input', {
  ...inputStyles,
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button,': {
    appearance: 'none'
  }
})
