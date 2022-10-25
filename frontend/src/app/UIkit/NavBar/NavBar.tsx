import { FC, ReactNode } from 'react'
import { styled } from '../../../styles'
import { Container } from '../Container'

export interface NavBarProps {
  brand?: ReactNode
  items?: ReactNode
  actions?: ReactNode
}

export const navBarHeightPx = 80

const NavBarStyled = styled('nav', {
  width: '100%',
  height: navBarHeightPx,
  position: 'fixed',
  zIndex: '1',
  top: 0,
  left: 0,
  right: 0,
  background: '$colors$whiteOp50',
  borderBottom: '2px solid $colors$whiteOp50',
  backdropFilter: 'blur(12.5px)',
  boxShadow: '$header',
  color: '$blue900'
})

const NavBarSpacer = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '30px'
})

export const NavBar: FC<NavBarProps> = ({ brand, items, actions }) => {
  return (
    <NavBarStyled>
      <Container css={{ height: '100%' }}>
        <NavBarSpacer>
          {brand}
          {items && (
            <NavBarSpacer css={{ flexGrow: 1 }}>
              {items}
            </NavBarSpacer>
          )}
          {actions}
        </NavBarSpacer>
      </Container>
    </NavBarStyled>
  )
}
