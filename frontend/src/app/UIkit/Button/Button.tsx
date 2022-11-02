import {
  ComponentProps,
  forwardRef
} from 'react'
import {
  AriaButtonProps
} from 'react-aria'
import { styled } from '../../../styles'
import { Drip } from '../Drip'
import { Txt } from '../Txt'
import { useButton } from './useButton'

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
  '&[data-disabled=true]': {
    cursor: 'not-allowed'
  },
  variants: {
    primary: {
      true: {
        color: '$white',
        background: '$gradients$main',
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
  }
})

export type ButtonProps = AriaButtonProps & ComponentProps<typeof ButtonStyled>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      ...props
    },
    ref
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)
    return (
      <ButtonStyled
        {...buttonProps}
        ref={buttonRef}
      >
        <Txt button1>{children}</Txt>
        <Drip {...dripProps} color='white' />
      </ButtonStyled>
    )
  }
)
