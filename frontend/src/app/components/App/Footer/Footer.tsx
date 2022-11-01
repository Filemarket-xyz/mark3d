import React from 'react'
import { styled } from '../../../../styles'
import { Container, Txt } from '../../../UIkit'

const FooterWrapper = styled('footer', {
  width: '100%',
  height: '64px',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backdropFilter: 'blur(12.5px)',
  boxShadow: '$footer',
  color: '$blue900',
  background: '$colors$whiteOp50'
})

const FooterContainer = styled(Container, {
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

const SocialsContainer = styled('div')

const Link = styled('a', {})

const SocialImage = styled('img')

const Options = styled('div')

const Info = styled('div')

const Divider = styled('div', {
  width: '2px',
  height: '18px',
  background: 'linear-gradient(180deg, #00DCFF 0%, #E14BEC 85.65%)',
  borderRadius: '2px'
})

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <Info>
          <Txt secondary1 css={{ fontSize: 14 }}>
            Copyright © 2022 Mark3d
          </Txt>
          <Divider />
          <Options>
            <Txt primary1>Privacy policy</Txt>
          </Options>
        </Info>
        <SocialsContainer>
          <Link>
            <SocialImage />
          </Link>
        </SocialsContainer>
      </FooterContainer>
    </FooterWrapper>
  )
}
