import { styled } from '../../../styles'
import { ComponentProps, FC, PropsWithChildren, useRef } from 'react'
import { Txt } from '../Txt'
import { mergeProps, useFocusRing, useHover, usePress } from 'react-aria'
import {Link} from '../Link';

export const NavLinkStyled = styled(Link, {
  color: '$blue900',
  '&.active:after': {

  }
})

export type NavBarItemProps = PropsWithChildren<ComponentProps<typeof NavLinkStyled>> & {
  isDisabled?: boolean
}

export const NavBarItem: FC<NavBarItemProps> = ({ children, isDisabled, ...navLinkProps }) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const { isHovered, hoverProps } = useHover({ isDisabled })
  const { isPressed, pressProps } = usePress({ isDisabled, ref })
  const { isFocusVisible, focusProps } = useFocusRing()
  return (
    <NavLinkStyled
      {...navLinkProps}
      {...mergeProps(hoverProps, pressProps, focusProps)}
      ref={ref}
      data-hovered={isHovered}
      data-pressed={isPressed}
      data-focus-visible={isFocusVisible}
    >
      <Txt button1>
        {children}
      </Txt>
    </NavLinkStyled>
  )
}
