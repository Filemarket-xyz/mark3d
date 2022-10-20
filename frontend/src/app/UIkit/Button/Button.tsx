import { ComponentProps, forwardRef, MouseEventHandler, useCallback } from 'react'
import { AriaButtonProps, mergeProps, useButton, useFocusRing, useHover } from 'react-aria'
import { styled } from '../../../styles'
import { useDrip } from '../Drip/Drip.hooks'
import { useDOMRef } from '../../hooks'
import { Drip } from '../Drip'
import { Txt } from '../Txt'

const ButtonStyled = styled('button', {
  height: '48px',
  minWidth: '160px',
  outline: 'none',
  border: 'none',
  borderRadius: '$4',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 24px',
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  fontFamily: '$primary',
  transition: 'transform 0.25s ease 0s, opacity 0.25s ease 0s',
  '&[data-pressed=true]': {
    transform: 'scale(0.97)'
  },
  '&[data-hovered=true]': {
    opacity: 0.7
  },
  variants: {
    primary: {
      true: {
        color: '$white',
        background: 'linear-gradient(270deg, $blue300 0%, $magenta 85.65%)',
        '&[data-focus-ring=true]': {
          focusRing: '$blue300'
        },
        '&[data-disabled=true]': {
          background: '$gray100',
          color: '$gray400',
          fill: '$gray400',
          cursor: 'not-allowed'
        }
      }
    },
    secondary: {
      true: {
        color: '$white',
        backgroundColor: '$blue500',
        '&[data-focus-ring=true]': {
          focusRing: '$blue500'
        },
        '&[data-disabled=true]': {
          background: '$gray100',
          color: '$gray400',
          fill: '$gray400',
          cursor: 'not-allowed'
        }
      }
    },
    tertiary: {
      true: {
        color: '$blue500',
        background: 'transparent',
        '&[data-focus-ring=true]': {
          focusRing: '$blue500'
        },
        '&[data-disabled=true]': {
          color: '$gray400',
          cursor: 'not-allowed'
        }
      }
    },
    small: {
      true: {
        height: '36px',
        minWidth: 0,
        padding: '0 18px'
      }
    }
  },
  defaultVariants: { primary: true }

})

export type ButtonProps = AriaButtonProps & ComponentProps<typeof ButtonStyled>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    isDisabled,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    ...btnProps
  },
  ref
  ) => {
    const buttonRef = useDOMRef(ref)
    const { onClick: onDripClickHandler, ...dripProps } = useDrip(buttonRef, false)

    const { isPressed, buttonProps } = useButton(
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
    const { onClick } = buttonProps

    const clickHandler = useCallback<MouseEventHandler<HTMLButtonElement>>((event) => {
      onClick?.(event)
      onDripClickHandler(event)
    }, [onClick, onDripClickHandler])

    const { isFocusVisible, focusProps } = useFocusRing()
    const { hoverProps, isHovered } = useHover({ isDisabled })
    return (
      <ButtonStyled
        {...btnProps}
        {...mergeProps(buttonProps, focusProps, hoverProps)}
        onClick={clickHandler}
        data-pressed={isPressed}
        data-hovered={isHovered}
        data-focus-ring={isFocusVisible}
        data-disabled={isDisabled}
        ref={buttonRef}
      >
        <Txt button1>
          {children}
        </Txt>
        <Drip {...dripProps} color="white"/>
      </ButtonStyled>
    )
  })
