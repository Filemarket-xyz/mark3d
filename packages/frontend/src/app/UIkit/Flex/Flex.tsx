
import { CSS } from '@stitches/react'
import React, { PropsWithChildren } from 'react'

import { StyledDiv } from './Flex.styles'

interface FlexProps extends PropsWithChildren {
  css?: CSS
  gap?: CSS['gap']
  alignItems?: CSS['alignItems']
  justifyContent?: CSS['justifyContent']
  flexDirection?: CSS['flexDirection']
  flexWrap?: CSS['flexWrap']
  w100?: boolean
  h100?: boolean
  className?: string
}

export const Flex: React.FC<FlexProps> = ({ children, h100, w100, css, className, ...props }) => {
  return (
    <StyledDiv
      className={className}
      css={{
        ...props,
        ...css,
        height: h100 ? '100%' : undefined,
        width: w100 ? '100%' : undefined,
      }}
    >
      {children}
    </StyledDiv>
  )
}
