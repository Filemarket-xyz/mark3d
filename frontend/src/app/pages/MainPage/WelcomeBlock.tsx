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
  fontWeight: '700',
  '@lg': {
    fontSize: 'calc(4vw + 35px)',
    textAlign: 'center'
  }
})

const ToolCard = styled(Card, {
  background: 'rgba(63, 63, 63, 0.25)',
  borderRadius: '$2',
  width: '350px',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  justifyContent: 'space-between',
  '@sm': {
    width: '90%'
  }
})

const ToolTitle = styled('h4', {
  fontSize: '$body1',
  fontWeight: '700',
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  }
})

const ToolDescription = styled('p', {
  fontSize: '$body1',
  fontWeight: '400',
  color: '$white',
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  }
})

const WelcomeInfo = styled(Container, {
  paddingTop: `calc(${navBarHeightPx}px + 25%)`,
  paddingBottom: '140px',
  '@sm': {
    paddingBottom: '$5'
  }
})

const ToolsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: '$4',
  '@lg': {
    justifyContent: 'center',
    marginTop: '$5'
  },
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const ButtonStyled = styled(Button, {
  color: '$blue900',
  variants: {
    magenta: {
      true: {
        background: '$gradient1'
      }
    },
    blue: {
      true: {
        background: '$gradient0'
      }
    }
  },
  '@sm': {
    fontSize: '$primary2'
  }
})

export default function WelcomeBlock() {
  return (
    <WelcomeScreenWrapper>
      <WelcomeInfo>
        <Title>ESSENTIAL TOOLS FOR 3D INTERNET</Title>
        <ToolsContainer>
          <ToolCard css={{ border: '6px solid $blue300' }}>
            <ToolTitle css={{ color: '$gradient0' }}>For 3D creators</ToolTitle>
            <ToolDescription>
              DAO-governed Platform for metaverse builders
            </ToolDescription>
            <ButtonStyled blue>Mint 3D NFT</ButtonStyled>
          </ToolCard>
          <ToolCard css={{ border: '6px solid $magenta' }}>
            <ToolTitle css={{ color: '$gradient1' }}>
              For virtual worlds
            </ToolTitle>
            <ToolDescription>
              SDK, smartontracts, API and oracle for games and virtual worlds
            </ToolDescription>
            <ButtonStyled magenta>Coming soon</ButtonStyled>
          </ToolCard>
        </ToolsContainer>
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
