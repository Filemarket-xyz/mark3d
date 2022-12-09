import React from 'react'
import { styled } from '../../../../styles'
import { Card, Container, textVariant, NavButton } from '../../../UIkit'
import { LinksBanner } from '../components/LinksBanner'
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
  fontSize: '70px',
  color: '$white',
  fontWeight: '600',
  '@lg': {
    fontSize: 'calc(3vw + 35px)',
    textAlign: 'center',
    margin: 'auto'
  },
  maxWidth: '755px',
  marginBottom: 0
})

const Description = styled('p', {
  ...textVariant('body1').true,
  fontWeight: 500,
  color: '$white',
  maxWidth: 730,
  marginTop: 64,
  '@lg': {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  '@sm': {
    marginTop: '$5'
  }
})

const ToolCard = styled(Card, {
  background: 'rgba(34, 34, 34, 0.45)',
  borderRadius: '$2',
  width: '350px',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  justifyContent: 'space-between',
  '@sm': {
    width: '90%'
  },
  backdropFilter: 'blur(45px)'
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
  },
  '@md': {
    paddingTop: 'calc($layout$navBarHeight + 96px)'
  }
})

const ToolsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: 64,
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
  textDecoration: 'none'
})

const LinksBannerWrapper = styled('div', {
  position: 'relative',
  top: '$layout$navBarHeight'
})

export default function WelcomeBlock() {
  return (
    <WelcomeScreenWrapper>
      <LinksBannerWrapper>
        <LinksBanner />
      </LinksBannerWrapper>

      <WelcomeInfo>
        <Title>
          WEB3 TOOLS FOR <br />
          NEW 3D INTERNET
        </Title>
        <Description>
          Building a universal toolkit for decentralized & transparent economic
          system of the Interoperable Metaverse, which is the key to justice in
          the society of the future
        </Description>
        <ToolsContainer>
          <ToolCard css={{ border: '6px solid $magenta' }}>
            <ToolTitle css={{ color: '$gradient1' }}>
              For virtual worlds
            </ToolTitle>
            <ToolDescription>
              SDK, smartontracts, API and oracle for games and virtual worlds
            </ToolDescription>
            <ButtonStyled magenta to={''}>
              Coming soon
            </ButtonStyled>
          </ToolCard>

          <ToolCard css={{ border: '6px solid $blue300' }}>
            <ToolTitle css={{ color: '$gradient0' }}>For 3D creators</ToolTitle>
            <ToolDescription>
              DAO-governed Platform for metaverse builders
            </ToolDescription>
            <ButtonStyled blue to={'/create/nft'}>
              Mint 3D NFT
            </ButtonStyled>
          </ToolCard>
        </ToolsContainer>
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
