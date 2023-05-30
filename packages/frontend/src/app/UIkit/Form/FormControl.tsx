import { styled } from '../../../styles'

export const FormControl = styled('div', {
  margin: '0 auto',
  marginBottom: '$4',
  maxWidth: '$breakpoints$sm',
  variants: {
    size: {
      lg: {
        maxWidth: '100%',
      },
    },
  },
})
