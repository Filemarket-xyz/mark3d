import { AriaButtonProps, useFocusRing, useHover, useButton as useButtonAria, mergeProps } from 'react-aria'
import { MouseEventHandler, Ref, RefObject, useCallback } from 'react'
import { useDOMRef } from '../../hooks'
import { useDrip } from '../Drip/Drip.hooks'

export function useButton<Props extends AriaButtonProps, Elem extends HTMLElement>(
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
    ...otherProps
  } = props
  const buttonRef = useDOMRef(ref)
  const { onClick: onDripClickHandler, ...dripProps } = useDrip(
    buttonRef,
    false
  )

  const { isPressed, buttonProps: ariaButtonProps } = useButtonAria(
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
  const { onClick } = ariaButtonProps

  const clickHandler = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      onClick?.(event)
      onDripClickHandler(event)
    },
    [onClick, onDripClickHandler]
  )

  const { isFocusVisible, focusProps } = useFocusRing()
  const { hoverProps, isHovered } = useHover({ isDisabled })
  return {
    buttonRef,
    buttonProps: {
      ...otherProps,
      ...mergeProps(ariaButtonProps, focusProps, hoverProps),
      onClick: clickHandler,
      'data-pressed': isPressed,
      'data-hovered': isHovered,
      'data-focus-ring': isFocusVisible,
      'data-disabled': isDisabled
    },
    dripProps
  }
}
