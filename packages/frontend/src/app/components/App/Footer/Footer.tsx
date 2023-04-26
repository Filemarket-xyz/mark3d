import React from 'react'
import { styled } from '../../../../styles'
import { Container, Link, Txt } from '../../../UIkit'
import Telegram from './img/Telegram.svg'
import Twitter from './img/Twitter.svg'
import BottomSection from "./section/Bottom/BottomSection";
import TopSection from "./section/Top/TopSection";

const FooterWrapper = styled('footer', {
  width: '100%',
  backdropFilter: 'blur(12.5px)',
  boxShadow: '$footer',
  color: '$blue900',
  background: '$colors$black',
})

const FooterContainer = styled(Container, {
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'center',
  color: '$white',
  paddingTB: '48px',
  '@md': {
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '$3'
  },
  '@sm': {
    alignItems: 'center'
  }
})


export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <TopSection/>
          <BottomSection/>
      </FooterContainer>
    </FooterWrapper>
  )
}
