import React, { PropsWithChildren } from 'react'

import { StyledFlex } from './NftCardInfoRow.styles'

export const NftCardInfoRow: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledFlex w100 justifyContent='space-between'>
      {children}
    </StyledFlex>
  )
}
