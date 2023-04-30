import { ComponentProps, forwardRef } from 'react'
import { AriaToggleButtonProps, mergeProps, useFocusRing, useToggleButton } from 'react-aria'
import { ToggleProps, useToggleState } from 'react-stately'

import { cssShowHideIn, styled } from '../../../../styles'
import { useDOMRef } from '../../../hooks'
import { NavbarToggleIcon } from './NavBarToggleIcon'

const StyledNavBarToggle = styled('button', cssShowHideIn, {
  // reset button styles
  appearance: 'none',
  background: 'transparent',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '$2',
  transition: 'box-shadow 0.25s ease 0s, opacity 0.25s ease 0s',
  '&[data-pressed=true]': {
    opacity: 0.7
  },
  '&[data-focus-ring]=true': {
    focusRing: '$blue500'
  }
})

export type NavBarToggleProps = Omit<ComponentProps<typeof StyledNavBarToggle>, 'onChange'> &
AriaToggleButtonProps &
ToggleProps

export const NavBarToggle = forwardRef<HTMLButtonElement, NavBarToggleProps>((props, ref) => {
  const {
    children,
    className,
    autoFocus,
    onChange,
    isSelected,
    css,
    ...otherProps
  } = props
  const domRef = useDOMRef(ref)
  const state = useToggleState({ isSelected, ...props })
  const { buttonProps, isPressed } = useToggleButton({ ...props, isSelected }, state, domRef)
  const { isFocusVisible, focusProps } = useFocusRing({ autoFocus })
  return (
    <StyledNavBarToggle
      ref={domRef}
      data-focus-ring={isFocusVisible}
      data-pressed={isPressed}
      {...mergeProps(buttonProps, focusProps, otherProps)}
    >
      <NavbarToggleIcon isExpanded={state.isSelected} />
    </StyledNavBarToggle>
  )
})
