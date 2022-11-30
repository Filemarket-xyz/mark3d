import { cssShowHideIn, styled } from '../../../../styles'
import { ComponentProps, FC, PropsWithChildren } from 'react'
import { Txt } from '../../Txt'
import { Link, NavLink } from '../../Link'

const navBarItemStyles = {
  color: '$blue900',
  position: 'relative',
  '&::after': {
    transition: 'opacity 0.25s ease 0s',
    opacity: 0,
    content: '',
    display: 'block',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: '$gradients$main',
    filter: 'blur(0.5px)'
  },
  '&.active::after': {
    opacity: 1
  }
}

export const NavLinkStyled = styled(NavLink, cssShowHideIn, navBarItemStyles)

export const LinkStyled = styled(Link, cssShowHideIn, navBarItemStyles)

export type NavBarItemProps = PropsWithChildren<ComponentProps<typeof NavLinkStyled>>

export const NavBarItem: FC<NavBarItemProps> = ({ children, ...navLinkProps }) => {
  return (
    <NavLinkStyled
      {...navLinkProps}
    >
      <Txt button1>
        {children}
      </Txt>
    </NavLinkStyled>
  )
}

export type NavBarItemLinkProps = PropsWithChildren<ComponentProps<typeof LinkStyled>>

export const NavBarItemLink: FC<NavBarItemLinkProps> = ({ children, ...navLinkProps }) => {
  return (
    <LinkStyled
      {...navLinkProps}
    >
      <Txt button1>
        {children}
      </Txt>
    </LinkStyled>
  )
}
