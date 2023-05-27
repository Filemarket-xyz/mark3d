import {
  ComponentProps,
  forwardRef,
} from 'react'
import {
  AriaButtonProps,
} from 'react-aria'
import { Link } from 'react-router-dom'

import { Drip } from '../../Drip'
import { buttonStyled } from '../Button.styles'
import { useButton } from '../useButton'

const NavButtonStyled = buttonStyled(Link)
export type NavButtonProps = AriaButtonProps & ComponentProps<typeof NavButtonStyled>

export const NavButton = forwardRef<HTMLAnchorElement, NavButtonProps>(
  (
    {
      children,
      ...props
    },
    ref,
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)

    return (
      <NavButtonStyled
        {...buttonProps}
        ref={buttonRef}
      >
        {children}
        <Drip {...dripProps} color='white' />
      </NavButtonStyled>
    )
  },
)
