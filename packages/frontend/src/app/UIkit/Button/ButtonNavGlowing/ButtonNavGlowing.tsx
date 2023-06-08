import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'

import { Drip } from '../../Drip'
import { buttonStyled } from '../Button.styles'
import { StyledGlow, StyledWrapper } from '../ButtonGlowing/ButtonGlowing.styles'
import { NavButtonProps } from '../NavButton'
import { useButton } from '../useButton'

const NavButtonStyled = buttonStyled(Link)

export const ButtonNavGlowing = forwardRef<HTMLAnchorElement, NavButtonProps>(
  (
    {
      children,
      ...props
    },
    ref,
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)

    return (
      <StyledWrapper>
        <StyledGlow />
        <NavButtonStyled
          {...buttonProps}
          ref={buttonRef}
        >
          {children}
          <Drip {...dripProps} color='white' />
        </NavButtonStyled>
      </StyledWrapper>
    )
  },
)
