import React from 'react'
import { styled } from '../../../styles'
import { Card, Container, navBarHeightPx, Button } from '../../UIkit'
import bg from './img/bg.jpg'

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bg})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
})

const Title = styled('h1', {
  fontSize: '80px',
  color: '$white',
  fontWeight: '700'
})

const ToolCard = styled(Card, {
  background: 'rgba(63, 63, 63, 0.25)',
  borderRadius: '$2',
  width: '350px',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  justifyContent: 'space-between'
})

const ToolTitle = styled('h4', {
  fontSize: '$body1',
  color: '$blue300',
  fontWeight: '700'
})

const ToolDescription = styled('p', {
  fontSize: '$body1',
  fontWeight: '400',
  color: '$white'
})

const WelcomeInfo = styled(Container, {
  paddingTop: `calc(${navBarHeightPx}px + 20%)`
})

const ToolsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: '$4'
})

export default function WelcomeScreen() {
  return (
    <WelcomeScreenWrapper>
      <WelcomeInfo>
        <Title>ESSENTIAL TOOLS FOR 3D INTERNET</Title>
        <ToolsContainer>
          <ToolCard css={{ border: '6px solid $blue300' }}>
            <ToolTitle>For 3D creators</ToolTitle>
            <ToolDescription>
              DAO-governed Platform for metaverse builders
            </ToolDescription>
            <Button css={{ background: '$gradient0', color: '$blue900' }}>
              Mint 3D NFT
            </Button>
          </ToolCard>
          <ToolCard css={{ border: '6px solid $magenta' }}>
            <ToolTitle>For virtual worlds</ToolTitle>
            <ToolDescription>
              SDK, smartontracts, API and oracle for games and virtual worlds
            </ToolDescription>
            <Button css={{ background: '$gradient1', color: '$blue900' }}>
              Coming soon
            </Button>
          </ToolCard>
        </ToolsContainer>
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
