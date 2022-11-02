import { FC } from 'react'
import { styled } from '../../../../styles'

export interface NavBarCollapseProps {
  isOpen?: boolean
}

const StyledNavbarCollapse = styled(
  'div',
  {
    $$navbarListColor: '$colors$text',
    $$navbarListBackgroundColor: '$colors$background',
    $$navbarListBlurBackgroundColor: '$colors$backgroundAlpha',
    $$navbarListBlur: '16px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: '$$navbarListBackgroundColor',
    width: '100%',
    height: '0px',
    zIndex: '$4',
    boxSizing: 'border-box',
    overflow: 'hidden',
    variants: {
      isOpen: {
        true: {
          top: '$$navbarHeight',
          pb: '$$navbarHeight',
          height: '100vh'
        }
      }
    }
  }
)

export const NavBarCollapse: FC<NavBarCollapseProps> = () => {
  return (<div></div>)
}
