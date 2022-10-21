import { FC, ReactNode } from 'react'
import { styled } from '../../../styles'
import { Container } from '../Container'

export interface NavBarProps {
  brand?: ReactNode
  items?: ReactNode
  actions?: ReactNode
}

const NavBarStyled = styled('nav', {
  width: '100%',
  height: '80px',
  position: 'fixed',
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
      <Container>
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
