import { ComponentProps, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { AriaButtonProps } from 'react-aria'
import { styled } from '../../../../styles'
import { Drip, useButton } from '../../../UIkit'
import logo from '../../../../assets/logo.png'
import mark3dBlack from '../../../../assets/mark3d.svg'
import mark3dGradient from '../../../../assets/mark3d-gradient.svg'

const height = 36

const Logo = styled('img', {
  height,
  objectFit: 'contain'
})

const NameContainer = styled('div', {
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

export type AppLogoButtonProps = AriaButtonProps & ComponentProps<typeof LinkStyled>

export const AppLogoButton = forwardRef<HTMLAnchorElement, AppLogoButtonProps>((
  {
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
      <Logo src={logo}/>
      <NameContainer>
        <Name
          src={mark3dBlack}
          className="black"
        />
        <Name
          src={mark3dGradient}
          className="gradient"
        />
      </NameContainer>
      <Drip {...dripProps}/>
    </LinkStyled>
  )
})
