import React from 'react'
import { styled } from '../../../../styles'
import {
  Card,
  Container,
  Button,
  textVariant
} from '../../../UIkit'
import bg from '../img/bg.jpg'

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bg})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
})

const Title = styled('h1', {
  ...textVariant('h1').true,
  fontSize: '70px',
  color: '$white',
  fontWeight: '600',
  textShadow: '1px 1px 0 #00DCFF80, -1px -1px 0 #E14BEC80',
  '@lg': {
    fontSize: 'calc(3vw + 35px)',
    textAlign: 'center'
  },
  maxWidth: '755px',
  marginBottom: 0
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
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  },
  ...textVariant('h4').true
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
  paddingTop: 'calc($layout$navBarHeight + 128px)',
  paddingBottom: '140px',
  '@sm': {
    paddingBottom: '$5'
  }
})

const ToolsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: 160,
  '@lg': {
    justifyContent: 'center',
    marginTop: 100
  },
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '$5'
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
        <Title>ESSENTIAL TOOLS<br/>FOR 3D INTERNET</Title>
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
