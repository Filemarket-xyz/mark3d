import { FC, PropsWithChildren } from 'react'
import { styled } from '../../../../styles'

export type NavBarCollapseProps = PropsWithChildren<{
  isOpen?: boolean
}>

const StyledNavBarCollapse = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backdropFilter: 'blur(12.5px)',
  background: '$whiteOp75',
  width: '100%',
  height: '0px',
  zIndex: '$4',
  overflow: 'hidden',
  variants: {
    isOpen: {
      true: {
        top: '$layout$navBarHeight',
        height: '100%'
      }
    }
  }
}
)

const StyledContent = styled('div', {
  paddingLeft: '$4',
  paddingTop: '$4',
  paddingBottom: '$layout$navBarHeight',
  overflowY: 'scroll',
  height: '100%',
  maxHeight: '100%'
})

export const NavBarCollapse: FC<NavBarCollapseProps> = ({ children, isOpen }) => {
  return (
    <StyledNavBarCollapse
      isOpen={isOpen}
    >
      <StyledContent>
        {children}
      </StyledContent>
    </StyledNavBarCollapse>
  )
}
