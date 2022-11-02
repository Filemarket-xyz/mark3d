import {
  ComponentProps,
  forwardRef
} from 'react'
import {
  AriaButtonProps
} from 'react-aria'
import { Drip } from '../../Drip'
import { Txt } from '../../Txt'
import { useButton } from '../useButton'
import { buttonStyled } from '../Button.styles'

const ButtonStyled = buttonStyled('button')
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
