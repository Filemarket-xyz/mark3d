import React, { useMemo } from 'react'

import { ButtonProps, useButton } from '../../../Button'
import { StyledButton } from './WhitelistCardButton.styles'

export interface WhitelistCardButtonProps extends ButtonProps {
  variant: 'free' | 'mint' | 'check' | 'notWl'

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
    if (variant === 'free' || variant === 'notWl') return 'FREE MINT'
    if (variant === 'check') return 'CHECK WL'

    return variant.toUpperCase()
  }, [variant, props.isDisabled])

  return (
    <StyledButton ref={buttonRef} {...buttonProps} variant={variant}>
      {text}
    </StyledButton>
  )
})
