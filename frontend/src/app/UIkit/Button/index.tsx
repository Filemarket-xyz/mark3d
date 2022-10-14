import { forwardRef, MouseEventHandler, useCallback } from 'react'
import { AriaButtonProps, HoverProps, useButton, useFocusVisible, useHover } from 'react-aria'
import { styled } from '../../../styles'
import { useDrip } from '../Drip/Drip.hooks'
import { useDOMRef } from '../../hooks'
import { Drip } from '../Drip'

const ButtonStyled = styled('button', {})

export type ButtonProps = AriaButtonProps & HoverProps

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    onPress,
    isDisabled,
    ...other
  },
  ref
  ) => {
    const buttonRef = useDOMRef(ref)
    const { onClick: onDripClickHandler, ...dripProps } = useDrip(buttonRef, false)

    const { isPressed, buttonProps } = useButton(
      {
        isDisabled,
        ...other
      },
      buttonRef
    )
    const { onClick } = buttonProps

    const clickHandler = useCallback<MouseEventHandler<HTMLButtonElement>>((event) => {
      onClick?.(event)
      onDripClickHandler(event)
    }, [onClick, onDripClickHandler])

    const { isFocusVisible } = useFocusVisible()
    const { hoverProps, isHovered } = useHover({ isDisabled, ...other })
    return (
      <ButtonStyled
        {...buttonProps}
        {...hoverProps}
        onClick={clickHandler}
        data-pressed={isPressed}
        data-focus-visible={isFocusVisible}
        data-disabled={isDisabled}
        data-hovered={isHovered}
      >
        <Drip {...dripProps}>
          {children}
        </Drip>
      </ButtonStyled>
    )
  })
