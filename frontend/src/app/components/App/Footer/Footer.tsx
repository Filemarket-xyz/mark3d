import React from 'react'
import { styled } from '../../../../styles'
import { Container, Link, Txt } from '../../../UIkit'
import Linkedin from './img/Linkedin.svg'
import Telegram from './img/Telegram.svg'
import Twitter from './img/Twitter.svg'
import Youtube from './img/Youtube.svg'
import Anchor from './img/Anchor.svg'
import Medium from './img/Medium.svg'

const FooterWrapper = styled('footer', {
  width: '100%',
  height: '64px',
  backdropFilter: 'blur(12.5px)',
  boxShadow: '$footer',
  color: '$blue900',
  background: '$colors$black',
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
  color: '$white',
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
  width: '1px',
  height: '18px',
  background: '$gray200',
  borderRadius: '2px',
  '@sm': {
    display: 'none'
  }
})

const date = new Date()

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <Info>
          <Txt secondary1 css={{ fontSize: 14 }}>
            Copyright © {date.getFullYear()} Mark3d
          </Txt>
          <Divider />
          <Link footer>Privacy policy</Link>
          <Link footer>Terms of Service</Link>
        </Info>
        <SocialsContainer>
          <Link
            href='http://twitter.com/mark3d_xyz'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Twitter} />
          </Link>

          <Link
            href='http://t.me/mark3d_xyz'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Telegram} />
          </Link>

          <Link
            href='https://anchor.fm/the-metaversed'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Anchor} />
          </Link>
          <Link
            href='https://medium.com/@mark3d'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Medium} />
          </Link>
          <Link
            href='http://youtube.com/@mark3d'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Youtube} />
          </Link>
          <Link
            href='http://linkedin.com/company/mark3dxyz/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Linkedin} />
          </Link>
        </SocialsContainer>
      </FooterContainer>
    </FooterWrapper>
  )
}
