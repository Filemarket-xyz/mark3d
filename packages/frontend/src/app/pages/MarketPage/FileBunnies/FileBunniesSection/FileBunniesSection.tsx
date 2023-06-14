import { observer } from 'mobx-react-lite'
import React from 'react'

import { styled } from '../../../../../styles'
import { useStores } from '../../../../hooks'
import { PageLayout, textVariant, Txt, WhitelistCard } from '../../../../UIkit'
import BottomBannerImg from '../../img/BottomBanner.png'
import FileBunniesBg from '../../img/FileBunniesBg.png'
import FileBunniesLogo from '../../img/FileBunniesLogoModal.svg'
import LeftBottomPl from '../../img/LeftBottomPlanet.png'
import LeftTopPl from '../../img/LeftTopPlanet.png'
import RightPl from '../../img/RigthPlanet.png'
import { FileBunniesMintButton } from '../FileBunniesMintButton/FileBunniesMintButton'
import {
  FileBunniesModal,
  HowMintModalBody,
  HowMintModalTitle,
  HowWorkModalBody,
  HowWorkModalTitle,
  RarityModalBody,
  RarityModalTitle,
} from '../FileBunniesModal/FileBunniesModal'

const FileBunniesSectionStyle = styled('div', {
  background: `url(${FileBunniesBg})`,
  width: '100%',
  color: 'white',
  position: 'relative',
  '& .leftBottomPl, .rightPl, .leftTopPl': {
    position: 'absolute',
  },
  '& .leftTopPl': {
    top: '13px',
  },
  '& .rightPl': {
    right: '0',
    top: '118px',
  },
  '& .leftBottomPl': {
    bottom: '96px',
    right: '0',
  },
  '@lg': {
    '& .leftBottomPl, .rightPl, .leftTopPl': {
      display: 'none',
    },
  },
})

const Title = styled('div', {
  ...textVariant('h1').true,
  fontSize: '48px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@sm': {
    fontSize: '24px',
    height: '70px',
    '& img': {
      width: '70px',
    },
  },
})

const FileBunniesLayout = styled(PageLayout, {
  background: 'none',
  paddingLR: '290px',
  '@xl': {
    paddingLR: '165px',
  },
  '@lg': {
    paddingLR: 'calc((100% - $breakpoints$md) * 0.554 + $space$4)',
  },
  '@md': {
    paddingLR: 'calc((100% - $breakpoints$sm) * 0.554 + $space$3)',
  },
  '@sm': {
    paddingLR: '$3',
  },
})

const MainContent = styled('div', {
  marginTop: '32px',
  display: 'flex',
  gap: '20px',
})

const LeftBlock = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '13px',
  width: '100%',
})

const LeftTextBlock = styled('div', {
  ...textVariant('primary1').true,
  background: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '16px',
  border: '1px solid $gray400',
  padding: '20px',
  backgroundBlendMode: 'overlay',
})

const LeftBlockTitle = styled('span', {
  fontSize: '32px',
  lineHeight: '40px',
  paddingBottom: '12px',
  '@xl': {
    fontSize: '24px',
  },
  '@sm': {
    fontSize: '20px',
    lineHeight: '24px',
  },
})

const LeftBlockText = styled('p', {
  marginTop: '12px',
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '32px',
  '@xl': {
    fontSize: '20px',
  },
  '@sm': {
    fontSize: '16px',
    lineHeight: '24px',
  },
})

const ToolTipBlock = styled('div', {
  background: 'rgba(255, 255, 255, 0.25)',
  backgroundBlendMode: 'overlay',
  borderRadius: '12px',
  padding: '14px',
  display: 'flex',
  justifyContent: 'center',
})

const BottomBanner = styled('div', {
  background: `url(${BottomBannerImg})`,
  height: '64px',
})

const FileBunniesSection = observer(() => {
  const { dialogStore } = useStores()

  const rarityModalOpen = () => {
    dialogStore.openDialog({
      component: FileBunniesModal,
      props: {
        body: <RarityModalBody />,
        title: <RarityModalTitle />,
      },
    })
  }

  const howToMintModalOpen = () => {
    dialogStore.openDialog({
      component: FileBunniesModal,
      props: {
        body: <HowMintModalBody />,
        title: <HowMintModalTitle />,
      },
    })
  }
  const howToWorkModalOpen = () => {
    dialogStore.openDialog({
      component: FileBunniesModal,
      props: {
        body: <HowWorkModalBody />,
        title: <HowWorkModalTitle />,
      },
    })
  }

  return (
    <FileBunniesSectionStyle>
      <FileBunniesLayout>
        <Title>
          <img src={FileBunniesLogo} />
          <span>
            <span style={{ textDecoration: 'underline' }}>FileBunnies</span>
            <span>
              {' '}
              Minting
            </span>
          </span>
        </Title>
        <MainContent>
          <LeftBlock>
            <LeftTextBlock>
              <LeftBlockTitle>
                The FileBunnies EFTs grants holders access to all ecosystem mints!
              </LeftBlockTitle>
              <LeftBlockText>
                FileBunnies holders will be granted exclusive
                access to all future NFT mints that occur
                on the FileMarket platform. This unique
                utility will allow the holder a White
                List spot for all content built on FileMarket.
              </LeftBlockText>
            </LeftTextBlock>
            <ToolTipBlock>
              <Txt style={{ borderBottom: '1px dashed', cursor: 'pointer' }} onClick={() => { rarityModalOpen() }}>FileBunnies Rarities</Txt>
            </ToolTipBlock>
            <ToolTipBlock>
              <Txt style={{ borderBottom: '1px dashed', cursor: 'pointer' }} onClick={() => { howToWorkModalOpen() }}>How NFT with EFT works?</Txt>
            </ToolTipBlock>
            <ToolTipBlock>
              <Txt style={{ borderBottom: '1px dashed', cursor: 'pointer' }} onClick={() => { howToMintModalOpen() }}>How to MINT FileBunnies?</Txt>
            </ToolTipBlock>
          </LeftBlock>
          <WhitelistCard
            variant={'whitelist'}
            rarityButtonProps={{
              onClick: () => {},
            }}
            buttonProps={{
              variant: 'free',
            }}
          />
          <WhitelistCard
            variant={'mint'}
            rarityButtonProps={{
              onClick: () => {},
            }}
            buttonProps={{
              variant: 'free',
            }}
          />
        </MainContent>
      </FileBunniesLayout>
      <img className={'leftTopPl'} src={LeftTopPl} />
      <img className={'leftBottomPl'} src={LeftBottomPl} />
      <img className={'rightPl'} src={RightPl} />
      <BottomBanner />
      <FileBunniesMintButton />
    </FileBunniesSectionStyle>
  )
})

export default FileBunniesSection
