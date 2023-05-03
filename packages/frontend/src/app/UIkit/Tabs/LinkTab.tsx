import { Tab } from '@mui/material'
import React, { ComponentProps } from 'react'

/** Should pass any content as icon property */
export default function LinkTab(props: ComponentProps<typeof Tab>) {
  return <Tab sx={{ textTransform: 'none' }} LinkComponent={'a'} {...props} />
}
