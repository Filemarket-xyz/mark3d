import { Tabs as MUITabs } from '@mui/material'
import React, { ComponentProps } from 'react'

/** Must pass value and onchange attributes */
export default function TabsBones(props: ComponentProps<typeof MUITabs>) {
  return (
    <MUITabs
      scrollButtons
      allowScrollButtonsMobile
      variant='scrollable'
      sx={{
        'span.MuiTabs-indicator': {
          height: '4px !important',
          background: 'linear-gradient(90deg, #38BCC9 0%, #088DFA 100%)'
        },
        'button.MuiTab-root': {
          fontFamily: 'Sora',
          fontWeight: 700,
          textTransform: 'initial',
          fontSize: '1.25rem'
        }
      }}
      {...props}
    >
    </MUITabs>
  )
}
