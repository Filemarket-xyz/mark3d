import React, { ReactNode } from 'react'

import { Loading } from '../../Loading'
import { StyledFlex, StyledRight, StyledTitle, StyledWrapper } from './PriceBadge.styles'

interface PriceBadgeProps {
  title?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  left: ReactNode
  right?: ReactNode
  background?: 'primary' | 'secondary'
  isLoading?: boolean
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  title,
  left,
  right,
  size = 'sm',
  background = 'primary',
  isLoading = false,
}) => {
  return (
    <StyledWrapper size={size} background={background}>
      {title && (
        <StyledTitle>
          {title}
        </StyledTitle>
      )}
      <Loading isLoading={isLoading}>
        <StyledFlex w100 justifyContent='space-between' size={size}>
          {left}
          {right && (
            <StyledRight>
              {right}
            </StyledRight>
          )}
        </StyledFlex>
      </Loading>
    </StyledWrapper>
  )
}
