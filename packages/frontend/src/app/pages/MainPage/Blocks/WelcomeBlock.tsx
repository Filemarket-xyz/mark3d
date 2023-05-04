import React from 'react'

import { styled } from '../../../../styles'
import { Container, LinkButton, NavButton, textVariant, ToolCard } from '../../../UIkit'
import { TechnologyStack } from '../components/TechnologyStack'
import bgStorage from '../img/bgStorage.svg'

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bgStorage})`,
  width: '100%',
  backgroundSize: 'auto 80%',
  backgroundRepeat: 'no-repeat',
  $$topPad: '128px',
  backgroundPosition: 'top $$topPad right -5%',
  '@xl': {
    backgroundPosition: 'top $$topPad right -15%'
  },
  '@lg': {
    background: 'none'
  }
})

const Title = styled('h1', {
  ...textVariant('h1').true,
  fontSize: '3.6rem',
  color: '$gray800',
  fontWeight: '700',
  '@lg': {
    fontSize: 'calc(1.5vw + 30px)',
    textAlign: 'center',
    margin: 'auto'
  },
  '@sm': {
    fontSize: 30,
    '& > br': {
      display: 'none'
    }
  },
  maxWidth: '730px',
  marginBottom: 0
})

const Description = styled('p', {
  ...textVariant('body1').true,
  fontWeight: 500,
  color: '$gray800',
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

export const ToolCardNarrow = styled(ToolCard, {
  width: '350px',
  '@sm': {
    width: '100%'
  }
})

export const ToolCardContent = styled('div', {
  gap: '$2',
  padding: '$4',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 350
})

export const ToolCardInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  '@md': {
    gap: '$3'
  }
})

export const ToolTitle = styled('h5', {
  color: '$white',
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  },
  ...textVariant('h5').true
})

export const ToolDescription = styled('p', {
  fontSize: '1.25rem',
  fontWeight: '500',
  color: '$white',
  '@md': {
    fontSize: '$body2'
  },
  '@sm': {
    fontSize: '$body3'
  }
})

const WelcomeInfo = styled(Container, {
  paddingTop: 'calc($layout$navBarHeight + 44px)',
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

export default function WelcomeBlock() {
  return (
    <WelcomeScreenWrapper>
      <WelcomeInfo>
        <Title>
          Store, sell, buy or send any files as NFTs
        </Title>
        <Description>
          Our new standard of NFT: Encrypted FileToken (EFT) using FVM allows perpetual storage of encrypted files on
          decentralized network of Filecoin & IPFS
        </Description>
        <ToolsContainer>
          <ToolCardNarrow>
            <ToolCardContent>
              <ToolCardInfo>
                <ToolTitle>For Digital Content Creators</ToolTitle>
                <ToolDescription>
                  Secure tokenization of any files, decentralized notary and storage, new monetization with access to
                  DeFi, DAO, Metaverse
                </ToolDescription>
              </ToolCardInfo>

              <NavButton secondary to={'/create/nft'}>
                Mint NFT File
              </NavButton>
            </ToolCardContent>
          </ToolCardNarrow>

          <ToolCardNarrow>
            <ToolCardContent>
              <ToolCardInfo>
                <ToolTitle>Create your own files online shop</ToolTitle>
                <ToolDescription>
                  Create and customize your own unique storefront on your domain with only your digital content
                </ToolDescription>
              </ToolCardInfo>

              <LinkButton target="_blank" secondary href="https://form.typeform.com/to/gulmhUKG">
                Make order
              </LinkButton>
            </ToolCardContent>
          </ToolCardNarrow>
        </ToolsContainer>
        <TechnologyStack />
      </WelcomeInfo>
    </WelcomeScreenWrapper>
  )
}
