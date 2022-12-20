import React from 'react'
import { styled } from '../../../../styles'
import {
  Container,
  NavButton,
  textVariant,
  ToolCard,
  ToolCardGradientBorder
} from '../../../UIkit'
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
  fontSize: 38,
  color: '$white',
  fontWeight: '600',
  '@lg': {
    fontSize: 'calc(1vw + 30px)',
    textAlign: 'center',
    margin: 'auto'
  },
  maxWidth: '730px',
  marginBottom: 0,
  textTransform: 'uppercase'
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

const ToolCardNarrow = styled(ToolCard, {
  width: '350px',
  '@sm': {
    width: '90%'
  }
})

const ToolCardContent = styled('div', {
  gap: '$2',
  padding: '$4',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 298
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
          3D NFTs for Metaverse with
          <br />
          encrypted content on Filecoin
        </Title>
        <Description>
          Mint NFTs with hidden 3D models stored on decentralized storage.
          Explore existing and upcoming engines for the Metaverse and integrate
          your NFT 3D models inside them. Let&apos;s co-create the new 3D Internet!
        </Description>
        <ToolsContainer>
          <ToolCardNarrow>
            <ToolCardGradientBorder>
              <ToolCardContent>
                <ToolCardInfo>
                  <ToolTitle>For 3D creators</ToolTitle>
                  <ToolDescription>
                    Info portal about Metaverse engines and NFT marketplace for
                    3D objects
                  </ToolDescription>
                </ToolCardInfo>

                <ButtonStyled primary to={'/create/nft'}>
                  Mint 3D NFT
                </ButtonStyled>
              </ToolCardContent>
            </ToolCardGradientBorder>
          </ToolCardNarrow>

          <ToolCardNarrow css={{ border: '4px solid $whiteOp50' }}>
            <ToolCardContent>
              <ToolCardInfo>
                <ToolTitle>For game developers</ToolTitle>
                <ToolDescription>
                  Web3 toolkit for an easy peasy integration of a crypto economy
                  into any virtual world
                </ToolDescription>
              </ToolCardInfo>

              <ButtonStyled
                isDisabled
                css={{ background: '$whiteOp50' }}
                to={''}
              >
                Coming soon
              </ButtonStyled>
            </ToolCardContent>
          </ToolCardNarrow>
        </ToolsContainer>
        <TechnologyStack />
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
