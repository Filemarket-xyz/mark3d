import { TabsProps } from '@mui/material'
import React from 'react'

import { StyledMuiTabs } from './MuiTabs.styles'

/** Must pass value and onchange attributes */
export const MuiTabs: React.FC<TabsProps> = (props) => {
  return (
    <StyledMuiTabs
      scrollButtons
      allowScrollButtonsMobile
      variant='scrollable'
      {...props}
    />
  )
}
