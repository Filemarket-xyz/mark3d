
import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'

export const StyledImg = styled('img', {
  objectFit: 'cover',
  borderRadius: 'inherit',
  width: '100%',
  height: '100%',
})

export const StyledPriceETH = styled('span', {
  ...textVariant('primary2'),
  color: '$gray800',
  fontWeight: '600',
})

export const StyledPriceUsd = styled('span', {
  color: '$gray600',
  fontWeight: '600',
})
