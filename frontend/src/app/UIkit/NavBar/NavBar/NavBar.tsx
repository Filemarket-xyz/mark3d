import { FC, ReactNode, useEffect, useState } from 'react'
import { BreakpointsOptions, cssShowHideIn, styled } from '../../../../styles'
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
  isMock?: boolean
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
}, cssShowHideIn)

const NavBarVerticalSpacer = styled('div', {
  dflex: 'start',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: '$3'
})

const itemTo = (item: NavBarItemData) =>
  item.isMock ? '/abracadabra1337' : item.to

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
              <NavBarHorizontalSpacer hideIn={mobileBp} css={{ flexGrow: 1 }}>
                {items.map((item, index) => item.isLink ? (
                    <NavBarItemLink
                      key={index}
                      href={itemTo(item)}
                      target="_blank"
                      hideIn={mobileBp}
                      mock={item.isMock}
                    >
                      {item.label}
                    </NavBarItemLink>
                ) : (
                  <NavBarItem
                    key={index}
                    to={itemTo(item)}
                    hideIn={mobileBp}
                    mock={item.isMock}
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
                key={index}
                mock={item.isMock}
                to={itemTo(item)}
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
