import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'

export const Header = styled('h4', {
  ...textVariant('h4').true,
  fontSize: '24px',
  lineHeight: '24px'
})

export const InfoBlockCard = styled('div', {
  padding: '32px',
  background: '#FFFFFF',
  boxShadow: '0px 4px 15px rgba(35, 37, 40, 0.15)',
  borderRadius: '24px',
  width: '100%'
})
