import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../../styles'
import { Button, Container, Link, LinkButton, textVariant } from '../../../UIkit'
import { MainBlock } from '../../GetAccessPage/GetAccessPage'
import FileBunniesBanner from '../components/FileBunniesBanner/FileBunniesBanner'
import HowToGetStart from '../components/HowToGetStart/HowToGetStart'
import bgStorage from '../img/bgStorage.svg'
import greenCircles from '../img/GreenCircles.svg'
import greenSun from '../img/GreenSun.svg'
import SupportedBy from './SupportedBy'

const BackgroundContainer = styled('section', {
  width: '100%',
})

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bgStorage}), url(${greenCircles})`,
  width: '100%',
  backgroundSize: '480px',
  backgroundRepeat: 'no-repeat',
  $$topPad: '260px',
  backgroundPosition: 'top $$topPad right 1.5%, top 188px right 0',
  position: 'relative',
  '& .greenSun': {
    zIndex: '1',
    position: 'absolute',
    top: '-50px',
    left: '-10px',
    '@lg': {
      display: 'none',
    },
  },
  '@xl': {
    backgroundPosition: 'top $$topPad right 2.5%, top 188px right 0, top -68px left -10px',
  },
  '@lg': {
    background: 'none',
  },
})
const Title = styled('h1', {
  ...textVariant('fourfold1').true,
  color: '$gray800',
  '@lg': {
    fontSize: 'calc(1.5vw + 30px)',
    textAlign: 'center',
    margin: 'auto',
  },
  '@sm': {
    fontSize: 30,
    '& > br': {
      display: 'none',
    },
  },
  maxWidth: '871px',
  marginBottom: 0,
})
const Description = styled('p', {
  ...textVariant('body1').true,
  fontWeight: 400,
  color: '$gray800',
  maxWidth: 776,
  marginTop: '$3',
  paddingBottom: '48px',
  '@lg': {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  '@sm': {
    marginTop: '$5',
    fontSize: '$body2',
  },
})

export const ToolCardContent = styled('div', {
  gap: '$2',
  padding: '$4',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 350,
})
export const ToolCardInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  '@md': {
    gap: '$3',
  },
})
export const ToolTitle = styled('h5', {
  color: '$white',
  '@md': {
    fontSize: '$body2',
  },
  '@sm': {
    fontSize: '$body3',
  },
  ...textVariant('h5').true,
})
export const ToolDescription = styled('p', {
  fontSize: '1.25rem',
  fontWeight: '500',
  color: '$white',
  '@md': {
    fontSize: '$body2',
  },
  '@sm': {
    fontSize: '$body3',
  },
})

const NavigateBlock = styled(MainBlock, {
  maxWidth: 777,
  padding: '64px 59px',
  flexDirection: 'column',
  gap: '42px',
  '& .buttonContainer': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    '@md': {
      flexDirection: 'column',
      gap: '12px',
    },
  },
  '@md': {
    padding: '48px 32px !important',
  },
  '@sm': {
    padding: '48px 24px !important',
  },
})

const NavigateTitle = styled('h4', {
  ...textVariant('fourfold2').true,
  '@md': {
    ...textVariant('fourfold3').true,
  },
})

const WelcomeInfo = styled(Container, {
  paddingTop: 'calc($layout$navBarHeight + 44px)',
  paddingBottom: '140px',
  zIndex: '2',
  position: 'relative',
  '@lg': {
    paddingTop: 'calc($layout$navBarHeight - 44px)',
  },
  '@md': {
    paddingTop: 'calc($layout$navBarHeight - 60px)',
  },
  '@sm': {
    paddingBottom: '$5',
  },
})

export default function WelcomeBlock() {
  const navigate = useNavigate()

  return (
    <BackgroundContainer>
      <FileBunniesBanner />
      <WelcomeScreenWrapper>
        <img src={greenSun} className={'greenSun'} />
        <WelcomeInfo>
          <Title>
            No code NFT shop builder with privacy layer & perpetual decentralized storage
          </Title>
          <Description>
            {'Multi-chain platform that serves as NFT shop builder and central marketplace/explorer utilizing FIlecoin decentralized storage with privacy protocol for NFTs -'}
            {' '}
            <Link
              target={'_blank'}
              href={'https://medium.com/filemarket-xyz/how-to-attach-an-encrypted-file-to-your-nft-7d6232fd6d34'}
              style={{
                fontSize: '1.25rem',
                borderBottom: '1px solid #0090FF',
                fontWeight: '400',
              }}
            >
              Encrypted FileToken (EFT)

            </Link>
            .
          </Description>
          <NavigateBlock>
            <NavigateTitle>Start tokenizing your content/data today:</NavigateTitle>
            <div className='buttonContainer'>
              <Button
                mediumMxWidth
                whiteWithBlue
                largeHg
                style={{ height: '80px', padding: '28px 59px' }}
                onClick={() => {
                  navigate('/create/eft')
                }}
              >
                Mint EFT right here
              </Button>
              <LinkButton
                mediumMxWidth
                whiteWithBlue
                largeHg
                href={'https://form.typeform.com/to/gulmhUKG?typeform-source=filemarket.xyz'}
                target={'_blank'}
                style={{
                  height: '80px',
                  padding: '28px 59px',
                  textAlign: 'center',
                }}
              >
                Apply for own shop
              </LinkButton>
            </div>
          </NavigateBlock>
          <SupportedBy />
          <HowToGetStart />
        </WelcomeInfo>
      </WelcomeScreenWrapper>
    </BackgroundContainer>
  )
}
