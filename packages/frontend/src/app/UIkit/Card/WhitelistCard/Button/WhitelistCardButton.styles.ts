import { styled } from '../../../../../styles'
import { buttonStyled } from '../../../Button/Button.styles'

export const Button = buttonStyled('button')

export const StyledButton = styled(Button, {
  textTransform: 'uppercase',
  borderColor: '$$color',
  color: '#191c29',
  boxShadow: '0 0 40px 40px $$color inset, 0 0 0 0 $$color',
  transition: 'all 150ms ease-in-out',
  background: '#191c29',
  fontSize: '$body2',
  '&[data-hovered=true]': {
    boxShadow: '0 0 10px 0 $$color inset, 0 0 10px 4px $$color',
    color: '$white',
    opacity: 1,
  },
  '&[data-disabled=true]': {
    opacity: 0.15,
    $$color: '$colors$white',
  },
  variants: {
    variant: {
      free: { $$color: '#8EFDB5' },
      mint: { $$color: '#01E3F8' },
      check: { $$color: '#DD5FEA' },
    },
  },
})
