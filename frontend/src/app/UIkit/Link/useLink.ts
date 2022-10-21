import { useDOMRef } from '../../hooks'
import { mergeProps, useFocusRing, useHover, usePress } from 'react-aria'
import { ForwardedRef } from 'react'

export const useLink = <T extends { isDisabled?: boolean }, >({ isDisabled, ...other }: T, ref: ForwardedRef<HTMLAnchorElement>) => {
  const linkRef = useDOMRef(ref)
  const { isHovered, hoverProps } = useHover({ isDisabled })
  const { isFocusVisible, focusProps } = useFocusRing()
  const { isPressed, pressProps } = usePress({ ref: linkRef })
  return {
    linkProps: {
      ...other,
      ...mergeProps(hoverProps, focusProps, pressProps),
      'data-hovered': isHovered,
      'data-focus-visible': isFocusVisible,
      'data-pressed': isPressed,
      'data-disabled': isDisabled
    },
    linkRef
  }
}
