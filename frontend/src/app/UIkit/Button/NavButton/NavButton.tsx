import {
  ComponentProps,
  forwardRef
} from 'react'
import {
  AriaButtonProps
} from 'react-aria'
import { Drip } from '../../Drip'
import { useButton } from '../useButton'
import { buttonStyled } from '../Button.styles'
import { Link } from 'react-router-dom'

const NavButtonStyled = buttonStyled(Link)
export type ButtonProps = AriaButtonProps & ComponentProps<typeof NavButtonStyled>

export const NavButton = forwardRef<HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      ...props
    },
    ref
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)
    return (
      <NavButtonStyled
        {...buttonProps}
        ref={buttonRef}
      >
        {children}
        <Drip {...dripProps} color='white'/>
      </NavButtonStyled>
    )
  }
)
