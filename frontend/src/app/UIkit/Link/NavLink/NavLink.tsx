import { linkStyled } from '../Link.styles'
import { NavLink as RouterNavLink } from 'react-router-dom'
import React, { ComponentProps, forwardRef } from 'react'
import { useLink } from '../useLink'

const NavLinkStyled = linkStyled(RouterNavLink)

export type NavLinkProps = ComponentProps<typeof NavLinkStyled> & {
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
