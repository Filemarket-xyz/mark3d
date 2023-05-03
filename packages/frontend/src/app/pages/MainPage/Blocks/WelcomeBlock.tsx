import React from 'react'
import { styled } from '../../../../styles'
import { Button, Container, Link, textVariant, ToolCard, Txt } from '../../../UIkit'
import lastUpdateImg from '../../../../assets/img/MainPage/LastUpdate.jpg'
import bgStorage from '../img/bgStorage.svg'
import Card from '../components/Card/Card'

const BackgroundContainer = styled('section', {
  background: 'linear-gradient(291.31deg, rgba(2, 145, 252, 0.25) 0%, rgba(74, 198, 209, 0.25) 100%), #FFFFFF;',
  width: '100%'
})

const WelcomeScreenWrapper = styled('section', {
  background: `url(${bgStorage})`,
  width: '100%',
  backgroundSize: 'auto 80%',
  backgroundRepeat: 'no-repeat',
  $$topPad: '128px',
  backgroundPosition: 'top $$topPad right -2.7%',
  '@xl': {
    backgroundPosition: 'top $$topPad right -3.1%'
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
  paddingBottom: '48px',
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

export default function WelcomeBlock() {
  return (
    <BackgroundContainer>
      <WelcomeScreenWrapper>
        <WelcomeInfo>
          <Title>
            Store, sell, buy or send any files as NFTs
          </Title>
          <Description>
            Welcome to the leading market for tokenized files! Send your digital content into the future of decentralized finance, organizations, metaverses, and the Data Economy!
          </Description>
          <Button primary mediumHg style={{
            marginBottom: '59px'
          }}><Txt h5>Explore</Txt></Button>
          <Card
            cardType={'main'}
            img={lastUpdateImg}
            headerText={'Last update'}
            imgHref={'#'}
            text={<Txt primary1 style={{ fontSize: '20px', fontWeight: 400 }}>The FileMarket.xyz team has just successfully completed the FVM Mainnet cohort (Filecoin incubator) and deployed their product on the Mainnet.</Txt>}
            rightBottomContent={<Link iconRedirect><Txt h5 style={{ fontWeight: 600 }}>All news</Txt></Link>}
          />
        </WelcomeInfo>
      </WelcomeScreenWrapper>
    </BackgroundContainer>
  )
}
