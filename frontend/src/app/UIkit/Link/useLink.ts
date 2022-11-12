import { useDOMRef } from '../../hooks'
import { mergeProps, useFocusRing, useHover, usePress } from 'react-aria'
import { ForwardedRef } from 'react'
import { PressEvent } from '@react-types/shared/src/events'

export const useLink = <T extends { isDisabled?: boolean, onPress?: (e: PressEvent) => void }, >(
  { isDisabled, onPress, ...other }: T,
  ref: ForwardedRef<HTMLAnchorElement>
) => {
  const linkRef = useDOMRef(ref)
  const { isHovered, hoverProps } = useHover({ isDisabled })
  const { isFocusVisible, focusProps } = useFocusRing()
  const { isPressed, pressProps } = usePress({ ref: linkRef, onPress })
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
