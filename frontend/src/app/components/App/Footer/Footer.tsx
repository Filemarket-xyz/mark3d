import React from 'react'
import { styled } from '../../../../styles'
import { Container } from '../../../UIkit'

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

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>123</FooterContainer>
    </FooterWrapper>
  )
}
