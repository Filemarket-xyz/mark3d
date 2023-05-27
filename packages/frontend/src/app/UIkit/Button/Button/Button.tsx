import {
  ComponentProps,
  forwardRef,
} from 'react'
import {
  AriaButtonProps,
} from 'react-aria'

import { Drip } from '../../Drip'
import { buttonStyled } from '../Button.styles'
import { useButton } from '../useButton'

const ButtonStyled = buttonStyled('button')
export type ButtonProps = AriaButtonProps & ComponentProps<typeof ButtonStyled>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      ...props
    },
    ref,
  ) => {
    const { buttonRef, buttonProps, dripProps } = useButton(props, ref)

    return (
      <ButtonStyled
        {...buttonProps}
        ref={buttonRef}
      >
        {children}
        <Drip {...dripProps} color='white' />
      </ButtonStyled>
    )
  },
)
