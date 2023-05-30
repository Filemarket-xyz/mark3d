import { styled as styledMui, Tab } from '@mui/material'

import { styled } from '../../../styles'
import { textVariant } from '../Txt'

export const StyledTab = styledMui(Tab)({
  textTransform: 'none',
})

export const StyledTabName = styled('p', {
  ...textVariant('h5').true,
  color: '$blue900',
})

export const StyledTabAmount = styled('p', {
  ...textVariant('h5').true,
  color: '$gray500',
})
