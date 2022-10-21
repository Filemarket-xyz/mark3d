import { styled } from '../../../styles'
import { ComponentProps } from 'react'
import { forwardRef } from '../../utils'
import { mergeProps, useFocusRing, useHover, usePress } from 'react-aria'
import { useDOMRef } from '../../hooks'

const LinkStyled = styled('a', {
  fontFamily: '$button',
  fontSize: '$button1',
  fontWeight: '$button',
  lineHeight: '$button',
  color: '$blue500',
  fill: '$blue500',
  transition: 'opacity 0.25s ease 0s',
  outline: 'none',
  textDecoration: 'none',
  cursor: 'pointer',

  '&[data-hovered=true]': {
    opacity: 0.7
  },
  '&[data-focus=true]': {
    focusRing: '$blue500'
  },
  '&[data-pressed=true]': {
    opacity: 0.9,
  },
  '&[data-disabled=true]': {
    color: '$gray400',
    fill: '$gray400',
    cursor: 'not-allowed'
  }
})

export type LinkProps = ComponentProps<typeof LinkStyled> & {
  isDisabled?: boolean
}

export const Link = forwardRef<LinkProps, 'a'>(({ isDisabled, ...linkProps }, ref) => {
  const linkRef = useDOMRef(ref)
  const { isHovered, hoverProps } = useHover({ isDisabled })
  const { isFocusVisible, focusProps } = useFocusRing()
  const { isPressed, pressProps } = usePress({ ref: linkRef })
  return (
    <LinkStyled
      {...linkProps}
      {...mergeProps(hoverProps, focusProps, pressProps)}
      ref={linkRef}
      data-hovered={isHovered}
      data-focus-visible={isFocusVisible}
      data-pressed={isPressed}
      data-disabled={isDisabled}
    />
  )
})
