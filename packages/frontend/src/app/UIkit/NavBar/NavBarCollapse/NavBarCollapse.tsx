import { ComponentProps, FC } from 'react'

import { styled } from '../../../../styles'
import { Container } from '../../Container'

const StyledNavBarCollapse = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backdropFilter: 'blur(12.5px)',
  background: '$blue500Op75',
  width: '100%',
  height: '0px',
  zIndex: 9,
  overflow: 'hidden',
  variants: {
    isOpen: {
      true: {
        top: '$layout$navBarHeight',
        height: '100%'
      }
    }
  }
})

export type NavBarCollapseProps = ComponentProps<typeof StyledNavBarCollapse> & {
  isOpen?: boolean
}

const StyledScrollContainer = styled('div', {
  overflowY: 'hidden', // make scroll if nav overflows
  height: '100%',
  maxHeight: '100%'
})

const StyledContent = styled('div', {
  paddingLeft: '$3',
  paddingTop: '$4',
  paddingBottom: '$layout$navBarHeight'
})

export const NavBarCollapse: FC<NavBarCollapseProps> = ({ children, isOpen }) => {
  return (
    <StyledNavBarCollapse
      isOpen={isOpen}
    >
      <StyledScrollContainer>
        <Container>
          <StyledContent>
            {children}
          </StyledContent>
        </Container>
      </StyledScrollContainer>
    </StyledNavBarCollapse>
  )
}
