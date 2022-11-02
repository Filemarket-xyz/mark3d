import { FC, ReactNode, useState } from 'react'
import { styled } from '../../../../styles'
import { Container } from '../../Container'
import { NavBarCollapse } from '../NavBarCollapse'
import { NavBarToggle } from '../NavBarToggle'

export interface NavBarProps {
  brand?: ReactNode
  items?: ReactNode
  actions?: ReactNode
}

const NavBarStyled = styled('nav', {
  width: '100%',
  height: '$layout$navBarHeight',
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
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <>
      <NavBarStyled>
        <Container css={{ height: '100%' }}>
          <NavBarSpacer>
            <NavBarToggle
              isSelected={isExpanded}
              onChange={setIsExpanded}
            />
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
      <NavBarCollapse isOpen={isExpanded}>
        <div color="black">Content</div>
      </NavBarCollapse>
    </>
  )
}
