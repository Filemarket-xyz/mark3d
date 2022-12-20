import { ComponentProps, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { AriaButtonProps } from 'react-aria'
import { BreakpointsOptions, cssShowHideIn, styled } from '../../../../styles'
import { Drip, useButton } from '../../../UIkit'
import LogoIcon from '../../../../assets/logo.png'
import Mark3dBlackIcon from '../../../../assets/Mark3d.svg'
import Mark3dGradientIcon from '../../../../assets/Mark3dGradient.svg'

const height = 36

const Logo = styled('img', {
  height,
  objectFit: 'contain'
})

const NameContainer = styled('div', cssShowHideIn, {
  width: '92px',
  height,
  position: 'relative'
})

const Name = styled('img', {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  objectFit: 'contain',
  objectPosition: '50% 50%' // center an image
})

const LinkStyled = styled(Link, {
  outline: 'none',
  border: 'none',
  userSelect: 'none',
  borderRadius: 0,
  background: 'transparent',
  display: 'inline-flex',
  gap: '$2',
  alignItems: 'center',
  justifyContent: 'start',
  padding: '0',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  fontFamily: '$primary',
  transition: 'transform 0.25s ease 0s',
  '& .gradient, & .black': {
    transition: 'opacity 0.25s ease 0s'
  },
  '& .gradient': {
    opacity: 0
  },
  '& .black': {
    opacity: 1
  },
  '&[data-pressed=true]': {
    transform: 'scale(0.97)'
  },
  '&[data-hovered=true]': {
    '.gradient': {
      opacity: 1
    },
    '.black': {
      opacity: 0
    }
  },
  '&[data-disabled=true]': {
    cursor: 'not-allowed'
  },
  '&[data-focus-ring=true]': {
    focusRing: '$blue500'
  }
})

export type AppLogoButtonProps = AriaButtonProps & ComponentProps<typeof LinkStyled> & {
  hideNameIn?: BreakpointsOptions
}

export const AppLogoButton = forwardRef<HTMLAnchorElement, AppLogoButtonProps>((
  {
    hideNameIn,
    ...otherProps
  },
  ref
) => {
  const {
    buttonRef,
    buttonProps,
    dripProps
  } = useButton(otherProps, ref)

  return (
    <LinkStyled
      {...buttonProps}
      ref={buttonRef}
    >
      <Logo
        src={LogoIcon}
        alt="Mark3d logo"
      />
      <NameContainer
        hideIn={hideNameIn}
      >
        <Name
          src={Mark3dBlackIcon}
          className="black"
          alt="Mark3d"
        />
        <Name
          src={Mark3dGradientIcon}
          className="gradient"
          alt="Mark3d"
        />
      </NameContainer>
      <Drip {...dripProps}/>
    </LinkStyled>
  )
})
