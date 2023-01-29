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

const LinkButtonStyled = buttonStyled('a')
export type NavLinkProps = AriaButtonProps & ComponentProps<typeof LinkButtonStyled>

export const LinkButton = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      children,
      ...props
    },
    ref
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)
    return (
      <LinkButtonStyled
        {...buttonProps}
        ref={buttonRef}
      >
        {children}
        <Drip {...dripProps} color='white'/>
      </LinkButtonStyled>
    )
  }
)
