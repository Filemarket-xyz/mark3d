import { FC, ReactNode, useState } from 'react'
import { styled } from '../../../../styles'
import { Container } from '../../Container'
import { NavBarCollapse } from '../NavBarCollapse'
import { NavBarToggle } from '../NavBarToggle'
import { NavBarItem } from '../NavBarItem'
import { NavBarCollapseItem } from '../NavBarCollapseItem'

export interface NavBarItemData {
  to: string
  label?: ReactNode
}

export interface NavBarProps {
  brand?: ReactNode
  items?: NavBarItemData[]
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

const NavBarHorizontalSpacer = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: '30px'
})

const NavBarVerticalSpacer = styled('div', {
  dflex: 'start',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: '$3'
})

export const NavBar: FC<NavBarProps> = ({ brand, items, actions }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <>
      <NavBarStyled>
        <Container css={{ height: '100%' }}>
          <NavBarHorizontalSpacer>
            <NavBarToggle
              isSelected={isExpanded}
              onChange={setIsExpanded}
            />
            {brand}
            {items && (
              <NavBarHorizontalSpacer css={{ flexGrow: 1 }}>
                {items.map(item => (
                  <NavBarItem key={item.to} to={item.to}>
                    {item.label}
                  </NavBarItem>
                ))}
              </NavBarHorizontalSpacer>
            )}
            {actions}
          </NavBarHorizontalSpacer>
        </Container>
      </NavBarStyled>
      {items && items.length > 0 && (
        <NavBarCollapse isOpen={isExpanded}>
          <NavBarVerticalSpacer>
            {items.map((item, index) => (
              <NavBarCollapseItem
                index={index}
                length={items?.length}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavBarCollapseItem>
            ))}
          </NavBarVerticalSpacer>
        </NavBarCollapse>
      )}
    </>
  )
}
