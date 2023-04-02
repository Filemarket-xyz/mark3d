import { styled } from '../../../styles'

export const Hide = styled('div', {
  variants: {
    hide: {
      true: {
        display: 'none'
      }
    }
  }
})
