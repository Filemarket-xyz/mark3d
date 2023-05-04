import { ComponentProps } from 'react'

import { styled } from '../../../../styles'

export const StyledNavBarToggleIconContainer = styled('div', {
  dflex: 'center',
  flexDirection: 'column',
  pointerEvents: 'none',
  size: '22px',
  '& .line': {
    height: '2px',
    width: '100%',
    backgroundColor: '$white',
    transition: 'transform 0.3s ease',
    '&.top': {
      transform: 'translateY(-4px) rotate(0deg)'
    },
    '&.bottom': {
      transform: 'translateY(4px) rotate(0deg)'
    }
  },
  variants: {
    isExpanded: {
      true: {
        '& .line': {
          '&.top': {
            transform: 'translateY(2px) rotate(45deg)'
          },
          '&.bottom': {
            transform: 'translateY(0px) rotate(-45deg)'
          }
        }
      }
    }
  }
})

type NavbarToggleIconProps = ComponentProps<typeof StyledNavBarToggleIconContainer> & {
  isExpanded?: boolean
}

export const NavbarToggleIcon: React.FC<NavbarToggleIconProps> = (props) => {
  const { isExpanded = false, ...otherProps } = props

  return (
    <StyledNavBarToggleIconContainer
      aria-hidden={true}
      isExpanded={isExpanded}
      tabIndex={-1}
      {...otherProps}
    >
      <span className="line top" />
      <span className="line bottom" />
    </StyledNavBarToggleIconContainer>
  )
}
