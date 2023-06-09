import React, { PropsWithChildren } from 'react'

import { gradientPlaceholderImg } from '../../Placeholder'
import { StyledImg, StyledImgContainer, StyledImgRoot, StyledImgWrapper } from './CardImg.styles'

interface CardImgProps extends PropsWithChildren {
  src: string
  variant?: 'primary' | 'secondary'
}

export const CardImg: React.FC<CardImgProps> = ({ children, src, variant = 'primary' }) => {
  return (
    <StyledImgRoot>
      <StyledImgWrapper variant={variant}>
        <StyledImgContainer variant={variant}>
          {children}
          <StyledImg
            src={src}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = gradientPlaceholderImg
            }}
          />
        </StyledImgContainer>
      </StyledImgWrapper>
    </StyledImgRoot>
  )
}
