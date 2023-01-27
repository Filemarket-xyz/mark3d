import { FC, ReactNode, useEffect, useState } from 'react'
import { BreakpointsOptions, styled } from '../../../../styles'
import { Container } from '../../Container'
import { NavBarCollapse } from '../NavBarCollapse'
import { NavBarToggle } from '../NavBarToggle'
import { NavBarItem, NavBarItemLink } from '../NavBarItem'
import { NavBarCollapseItem } from '../NavBarCollapseItem'
import { useLocation } from 'react-router-dom'

export interface NavBarItemData {
  to: string
  label?: ReactNode
  isLink?: boolean
}

export interface NavBarProps {
  brand?: ReactNode
  items?: NavBarItemData[]
  actions?: ReactNode
  mobileBp?: BreakpointsOptions
}

const NavBarStyled = styled('nav', {
  width: '100%',
  height: '$layout$navBarHeight',
  position: 'fixed',
  zIndex: 10,
  top: 0,
  left: 0,
  right: 0,
  background: '$colors$blue500',
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

export const NavBar: FC<NavBarProps> = ({
  brand,
  items,
  actions,
  mobileBp
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    setIsExpanded(false)
  }, [pathname])
  return (
    <>
      <NavBarStyled>
        <Container css={{ height: '100%' }}>
          <NavBarHorizontalSpacer>
            <NavBarToggle
              isSelected={isExpanded}
              onChange={setIsExpanded}
              showIn={mobileBp}
            />
            {brand}
            {items && (
              <NavBarHorizontalSpacer css={{ flexGrow: 1 }}>
                {items.map(item => item.isLink ? (
                    <NavBarItemLink
                      key={item.to}
                      href={item.to}
                      target="_blank"
                      hideIn={mobileBp}
                    >
                      {item.label}
                    </NavBarItemLink>
                ) : (
                  <NavBarItem
                    key={item.to}
                    to={item.to}
                    hideIn={mobileBp}
                  >
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
        <NavBarCollapse
          isOpen={isExpanded}
        >
          <NavBarVerticalSpacer>
            {items.map((item, index) => (
              <NavBarCollapseItem
                isVisible={isExpanded}
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
