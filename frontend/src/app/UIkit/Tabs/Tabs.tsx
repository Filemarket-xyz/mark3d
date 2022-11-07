import React, { ComponentProps } from 'react'
import { Tabs as MUITabs } from '@mui/material'

/** Must pass value and onchange attributes */
export default function Tabs(props: ComponentProps<typeof MUITabs>) {
  return (
    <MUITabs
      scrollButtons
      variant={'scrollable'}
      allowScrollButtonsMobile
      sx={{
        'span.MuiTabs-indicator': {
          height: '4px !important',
          background: 'linear-gradient(270deg, #00DCFF 0%, #E14BEC 85.65%)'
        },
        'button.MuiTab-root': {
          fontFamily: 'Sora',
          fontWeight: 700,
          textTransform: 'initial',
          fontSize: '1.25rem'
        }
      }}
      {...props}
    ></MUITabs>
  )
}
