import React, { useMemo } from 'react'

import { ButtonProps, useButton } from '../../../Button'
import { StyledButton } from './WhitelistCardButton.styles'

export interface WhitelistCardButtonProps extends ButtonProps {
  variant: 'free' | 'mint' | 'check'
}

export const WhitelistCardButton = React.forwardRef<HTMLButtonElement, WhitelistCardButtonProps>((
  {
    variant,
    ...props
  },
  ref,
) => {
  const { buttonRef, buttonProps } = useButton(props, ref)

  const text = useMemo(() => {
    if (variant === 'free') return 'free mint'
    if (variant === 'check') return 'check wl'

    return variant
  }, [variant])

  return (
    <StyledButton ref={buttonRef} {...buttonProps} variant={variant}>
      {text}
    </StyledButton>
  )
})
