import { styled } from '../../../styles'
import { ComponentProps, FC, PropsWithChildren } from 'react'
import { Txt } from '../Txt'
import { NavLink } from '../Link'

export const NavLinkStyled = styled(NavLink, {
  color: '$blue900',
  position: 'relative',
  '&.active::after': {
    content: '',
    display: 'block',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: '$gradients$main',
    filter: 'blur(0.5px)'
  }
})

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
