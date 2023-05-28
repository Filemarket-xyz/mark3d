import { keyframes, styled } from '../../../../styles'
import { buttonStyled } from '../Button.styles'

export const StyledButton = buttonStyled('button')

export const animationGlow = keyframes({
  '0%': {
    backgroundPosition: '0% 50%',
  },
  '100%': {
    backgroundPosition: '200% 50%',
  },
})

export const StyledWrapper = styled('div', {
  position: 'relative',
  width: 'fit-content',
  '&:hover > div': {
    animationDuration: '1.5s',
  },
})

export const StyledGlow = styled('div', {
  position: 'absolute',
  content: '',
  top: 8,
  left: 0,
  right: 0,
  height: '100%',
  width: '100%',
  transform: 'scale(0.9) translateZ(0)',
  filter: 'blur(15px)',
  background: '$gradients$button',
  animation: `${animationGlow} 3s linear infinite`,
  animationDelay: '0.5s',
  backgroundSize: '200% 200%',
})
