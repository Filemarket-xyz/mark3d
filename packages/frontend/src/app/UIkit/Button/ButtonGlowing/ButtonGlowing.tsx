import React from 'react'

import { Drip } from '../../Drip'
import { ButtonProps } from '../Button/Button'
import { useButton } from '../useButton'
import { StyledButton, StyledGlow, StyledWrapper } from './ButtonGlowing.styles'

export const ButtonGlowing = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  const { buttonRef, buttonProps, dripProps } = useButton(props, ref)

  return (
    <StyledWrapper>
      <StyledGlow />
      <StyledButton
        {...buttonProps}
        ref={buttonRef}
      >
        {children}
        <Drip {...dripProps} color='white' />
      </StyledButton>
    </StyledWrapper>
  )
},
)
