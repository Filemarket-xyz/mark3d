import React, { ReactNode } from 'react'

import { StyledFlex, StyledRight, StyledTitle, StyledWrapper } from './PriceBadge.styles'

interface PriceBadgeProps {
  title?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  left: ReactNode
  right?: ReactNode
  background?: 'primary' | 'secondary'
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ title, left, right, size = 'sm', background = 'primary' }) => {
  return (
    <StyledWrapper size={size} background={background}>
      {title && (
        <StyledTitle>
          {title}
        </StyledTitle>
      )}
      <StyledFlex w100 justifyContent='space-between' size={size}>
        {left}
        {right && (
          <StyledRight>
            {right}
          </StyledRight>
        )}
      </StyledFlex>
    </StyledWrapper>
  )
}
