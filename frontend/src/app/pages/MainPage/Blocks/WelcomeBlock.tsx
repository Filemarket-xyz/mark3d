import React from 'react'
import { styled } from '../../../../styles'
import { Card, Container, textVariant, NavButton } from '../../../UIkit'
import { TechnologyStack } from '../components/TechnologyStack'
import bg from '../img/bg.jpg'

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bg})`,
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: '85%'
})

const Title = styled('h1', {
  ...textVariant('h1').true,
  fontSize: '52px',
  color: '$white',
  fontWeight: '600',
  '@lg': {
    fontSize: 'calc(2vw + 30px)',
    textAlign: 'center',
    margin: 'auto'
  },
  maxWidth: '730px',
  marginBottom: 0
})

const Description = styled('p', {
  ...textVariant('body1').true,
  fontWeight: 500,
  color: '$white',
  maxWidth: 730,
  marginTop: '$3',
  '@lg': {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  '@sm': {
    marginTop: '$5',
    fontSize: '$body2'
  }
})

const ToolCard = styled(Card, {
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '$4',
  width: '350px',
  minHeight: 298,
  gap: '$2',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '@sm': {
    width: '90%'
  },
  backdropFilter: 'blur(45px)'
})

const ToolCardInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  '@md': {
    gap: '$3'
  }
})

const ToolTitle = styled('h4', {
  color: '$white',
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  },
  ...textVariant('h4').true,
  fontSize: 24
})

const ToolDescription = styled('p', {
  fontSize: 22,
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
  paddingTop: 'calc($layout$navBarHeight + $layout$bannerHeight + 44px)',
  paddingBottom: '140px',
  '@sm': {
    paddingBottom: '$5'
  }
})

const ToolsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: 48,
  '@lg': {
    justifyContent: 'center'
  },
  '@sm': {
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const ButtonStyled = styled(NavButton, {
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
  },
  textDecoration: 'none',
  flexShrink: 0
})

export default function WelcomeBlock() {
  return (
    <WelcomeScreenWrapper>
      <WelcomeInfo>
        <Title>
          PORTAL TO NEW WEB3
          <br />
          METAVERSED 3D INTERNET
        </Title>
        <Description>
          Building a universal toolkit for decentralized & transparent economic
          system of the Interoperable Metaverse, which is the key to justice in
          the society of the future
        </Description>
        <ToolsContainer>
          <ToolCard
            css={{
              border: '4px solid transparent'
            }}
          >
            <ToolCardInfo>
              <ToolTitle>For 3D creators</ToolTitle>
              <ToolDescription>
                DAO-governed Platform for metaverse builders
              </ToolDescription>
            </ToolCardInfo>

            <ButtonStyled primary to={'/create/nft'}>
              Mint 3D NFT
            </ButtonStyled>
          </ToolCard>

          <ToolCard css={{ border: '4px solid $whiteOp50' }}>
            <ToolCardInfo>
              <ToolTitle>For virtual worlds</ToolTitle>
              <ToolDescription>
                SDK, smartontracts, API and oracle for games and virtual worlds
              </ToolDescription>
            </ToolCardInfo>

            <ButtonStyled isDisabled css={{ background: '$whiteOp50' }} to={''}>
              Coming soon
            </ButtonStyled>
          </ToolCard>
        </ToolsContainer>
        <TechnologyStack />
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
