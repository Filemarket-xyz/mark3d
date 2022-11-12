import React from 'react'
import { styled } from '../../../../styles'
import { Container, textVariant, Txt } from '../../../UIkit'
import Discord from './img/Discord.svg'
import Instagram from './img/Instagram.svg'
import Linkedin from './img/Linkedin.svg'
import Telegram from './img/Telegram.svg'
import Twitter from './img/Twitter.svg'
import Youtube from './img/Youtube.svg'

const FooterWrapper = styled('footer', {
  width: '100%',
  height: '64px',
  backdropFilter: 'blur(12.5px)',
  boxShadow: '$footer',
  color: '$blue900',
  background: '$colors$whiteOp50',
  '@md': {
    height: '96px'
  },
  '@sm': {
    height: '128px'
  }
})

const FooterContainer = styled(Container, {
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@md': {
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '$3'
  },
  '@sm': {
    alignItems: 'center'
  }
})

const SocialsContainer = styled('div', {
  display: 'flex',
  gap: '10px'
})

const Link = styled('a', {
  ...textVariant('primary1'),
  fontSize: 14,
  color: '$gray500',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center'
})

const SocialImage = styled('img', { width: '32px', height: '32px' })

const Info = styled('div', {
  display: 'flex',
  gap: '$4',
  '@sm': {
    flexDirection: 'column',
    gap: '0',
    alignItems: 'center'
  }
})

const Divider = styled('div', {
  width: '2px',
  height: '18px',
  background: 'linear-gradient(180deg, #00DCFF 0%, #E14BEC 85.65%)',
  borderRadius: '2px',
  '@sm': {
    display: 'none'
  }
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
          <Link>Privacy policy</Link>
          <Link>Terms of Service</Link>
        </Info>
        <SocialsContainer>
          <Link>
            <SocialImage src={Discord} />
          </Link>
          <Link>
            <SocialImage src={Instagram} />
          </Link>
          <Link>
            <SocialImage src={Linkedin} />
          </Link>
          <Link>
            <SocialImage src={Telegram} />
          </Link>
          <Link>
            <SocialImage src={Twitter} />
          </Link>
          <Link>
            <SocialImage src={Youtube} />
          </Link>
        </SocialsContainer>
      </FooterContainer>
    </FooterWrapper>
  )
}
