import { HTMLAttributes, MouseEventHandler, Ref, RefObject, useCallback } from 'react'
import { AriaButtonProps, mergeProps, useButton as useButtonAria, useFocusRing, useHover } from 'react-aria'

import { useDOMRef } from '../../hooks'
import { useDrip } from '../Drip/Drip.hooks'

export function useButton<Props extends AriaButtonProps & HTMLAttributes<HTMLSpanElement>, Elem extends HTMLElement>(
  props: Props,
  ref?: RefObject<Elem | null> | Ref<Elem | null>
) {
  const {
    isDisabled,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    onClick: deprecatedOnClick,
    ...otherProps
  } = props
  const buttonRef = useDOMRef(ref)
  const { onClick: onDripClickHandler, ...dripProps } = useDrip(
    buttonRef,
    false
  )

  const { isPressed, buttonProps: ariaButtonPropsFull } = useButtonAria(
    {
      isDisabled,
      onPress,
      onPressStart,
      onPressEnd,
      onPressChange,
      onPressUp
    },
    buttonRef
  )
  const { onClick, ...ariaButtonProps } = ariaButtonPropsFull

  const clickHandler = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event)
      deprecatedOnClick?.(event)
      onDripClickHandler(event)
    },
    [onClick, onDripClickHandler]
  )

  const { isFocusVisible, focusProps } = useFocusRing()
  const { hoverProps, isHovered } = useHover({ isDisabled })
  return {
    buttonRef,
    buttonProps: {
      ...mergeProps(ariaButtonProps, focusProps, hoverProps),
      ...otherProps,
      onClick: clickHandler,
      'data-pressed': isPressed,
      'data-hovered': isHovered,
      'data-focus-ring': isFocusVisible,
      'data-disabled': isDisabled
    },
    dripProps
  }
}
