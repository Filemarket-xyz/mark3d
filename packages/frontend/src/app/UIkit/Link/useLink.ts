import { PressEvent } from '@react-types/shared/src/events'
import { ForwardedRef } from 'react'
import { mergeProps, useFocusRing, useHover, usePress } from 'react-aria'

import { useDOMRef } from '../../hooks'

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
