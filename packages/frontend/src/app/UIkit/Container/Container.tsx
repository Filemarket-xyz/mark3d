import { styled } from '../../../styles'

export const Container = styled('div', {
  width: '100%',
  paddingLR: 'calc((100% - $breakpoints$xl) * 0.3 + $space$4)',
  '@xl': {
    paddingLR: 'calc((100% - $breakpoints$lg) * 0.554 + $space$4)'
  },
  '@lg': {
    paddingLR: 'calc((100% - $breakpoints$md) * 0.554 + $space$4)'
  },
  '@md': {
    paddingLR: 'calc((100% - $breakpoints$sm) * 0.554 + $space$3)'
  },
  '@sm': {
    paddingLR: '$3'
  }
})
