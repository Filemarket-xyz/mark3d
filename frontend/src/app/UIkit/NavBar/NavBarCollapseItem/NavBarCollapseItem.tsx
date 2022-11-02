import { NavLink } from '../../Link'
import { ComponentProps, FC, useMemo } from 'react'
import { styled } from '../../../../styles'

const transitionDelay = 0
const transitionTime = 350
const transitionMatrix = { in: 'matrix(1, 0, 0, 1, 0, 0)', out: 'matrix(0.97, 0, 0, 1, 0, 20)' }

const StyledNavLink = styled(NavLink, {
  color: '$blue900',
  display: 'block'
})

type NavBarCollapseItemProps = ComponentProps<typeof StyledNavLink> & {
  index: number
  length: number
  isVisible?: boolean // for animation purposes
}

export const NavBarCollapseItem: FC<NavBarCollapseItemProps> = ({
  index,
  length,
  isVisible,
  children,
  ...otherProps
}) => {
  const timeDelay = useMemo(
    () =>
      index > -1 && length > 0
        ? (index / length) * 0.5 * 1000 + transitionDelay
        : 0.1,
    [index, length]
  )

  return (
    <StyledNavLink
      css={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? transitionMatrix.in : transitionMatrix.out,
        // eslint-disable-next-line max-len
        transition: `opacity ${transitionTime}ms cubic-bezier(0.5, 0, 0, 1) ${timeDelay}ms, transform ${transitionTime}ms cubic-bezier(0.5, 0, 0, 1) ${timeDelay}ms`
      }}
      {...otherProps}
    >
      {children}
    </StyledNavLink>
  )
}
