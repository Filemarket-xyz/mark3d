import React from 'react'
import { styled } from '../../../../styles'
import { Container, Link, Txt } from '../../../UIkit'
import Telegram from './img/Telegram.svg'
import Twitter from './img/Twitter.svg'

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
            Copyright © {date.getFullYear()} FileMarket
          </Txt>
          <Divider />
          <Link footer>Privacy policy</Link>
          <Link footer>Terms of Service</Link>
        </Info>
        <SocialsContainer>
          <Link
            href='https://twitter.com/filemarket_xyz'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Twitter} />
          </Link>

          <Link
            href='https://t.me/filemarketchat'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Telegram} />
          </Link>

          <Link
            href='https://t.me/filemarketofficial'
            target='_blank'
            rel='noopener noreferrer'
          >
            <SocialImage src={Telegram} />
          </Link>
        </SocialsContainer>
      </FooterContainer>
    </FooterWrapper>
  )
}
