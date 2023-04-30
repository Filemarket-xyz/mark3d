import React, { ComponentProps, forwardRef } from 'react'
import { PressHookProps } from 'react-aria'
import { NavLink as RouterNavLink } from 'react-router-dom'

import { linkStyled } from '../Link.styles'
import { useLink } from '../useLink'

const NavLinkStyled = linkStyled(RouterNavLink)

export type NavLinkProps = ComponentProps<typeof NavLinkStyled> & PressHookProps & {
  isDisabled?: boolean
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { linkRef, linkProps } = useLink(props, ref)
  return (
    <NavLinkStyled
      {...linkProps}
      ref={linkRef}
    />
  )
})
