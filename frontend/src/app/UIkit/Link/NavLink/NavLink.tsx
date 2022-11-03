import { linkStyled } from '../Link.styles'
import { NavLink as RouterNavLink } from 'react-router-dom'
import React, { ComponentProps, forwardRef } from 'react'
import { useLink } from '../useLink'
import { PressHookProps } from 'react-aria'

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
