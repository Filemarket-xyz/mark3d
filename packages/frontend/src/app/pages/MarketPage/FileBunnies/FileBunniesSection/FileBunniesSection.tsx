import { Tooltip } from '@nextui-org/react'
import React from 'react'

import { styled } from '../../../../../styles'
import { PageLayout, textVariant } from '../../../../UIkit'
import FileBunniesBg from '../../img/FileBunniesBg.png'
import FileBunniesLogo from '../../img/FileBunniesLogo.svg'

const FileBunniesSectionStyle = styled('div', {
  background: `url(${FileBunniesBg})`,
  width: '100%',
  color: 'white',
})

const Title = styled('div', {
  ...textVariant('h1').true,
  fontSize: '48px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const MainContent = styled('div', {
  marginTop: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '13px',
  width: '640px',
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
})

const LeftBlockText = styled('p', {
  marginTop: '12px',
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '32px',
})

const ToolTipBlock = styled('div', {
  background: 'rgba(255, 255, 255, 0.25)',
  backgroundBlendMode: 'overlay',
  borderRadius: '12px',
  padding: '14px',
  display: 'flex',
  justifyContent: 'center',
})

const FileBunniesSection = () => {
  return (
    <FileBunniesSectionStyle>
      <PageLayout style={{ background: 'none' }}>
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
            <Tooltip content={'ДЕвочка вендздей'}>FileBunnies Rarities</Tooltip>
          </ToolTipBlock>
          <ToolTipBlock>
            <Tooltip content={'ДЕвочка вендздей'}>How NFT with EFT works?</Tooltip>
          </ToolTipBlock>
          <ToolTipBlock>
            <Tooltip content={'ДЕвочка вендздей'}>How to MINT FileBunnies?</Tooltip>
          </ToolTipBlock>
        </MainContent>
      </PageLayout>
    </FileBunniesSectionStyle>
  )
}

export default FileBunniesSection
