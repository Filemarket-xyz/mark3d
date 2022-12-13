import React from 'react'
import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'

// icons
import Anchor from '../img/BannerIcons/Anchor.svg'
import LinkedIn from '../img/BannerIcons/LinkedIn.svg'
import Medium from '../img/BannerIcons/Medium.svg'
import Telegram from '../img/BannerIcons/Telegram.svg'
import Twitter from '../img/BannerIcons/Twitter.svg'
import Youtube from '../img/BannerIcons/Youtube.svg'

const Wrapper = styled('div', {
  background: '$gradients$main',
  height: '$layout$bannerHeight',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  justifyContent: 'center',
  '@lg': {
    justifyContent: 'start'
  },
  overflowX: 'auto',
  paddingLR: '$1',
  width: '100%',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
  position: 'fixed',
  top: '$layout$navBarHeight',
  zIndex: 2
})

const ItemIcon = styled('img', {
  width: 20,
  height: 20
})

const Item = styled('a', {
  display: 'flex',
  gap: '$1',
  alignItems: 'center',
  textDecoration: 'none',
  flexShrink: 0
})

const Itemtext = styled('span', {
  color: '$whiteOp75',
  ...textVariant('primary3').true
})

export const LinksBanner = () => {
  return (
    <Wrapper>
      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Twitter} />
        <Itemtext>MetaTwitter</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Telegram} />
        <Itemtext>Telegram for Metaverse builders</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Medium} />
        <Itemtext>Metaverse Review</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Anchor} />
        <Itemtext>The Metaversed Podcast</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Youtube} />
        <Itemtext>The Metaverse TV</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={Telegram} />
        <Itemtext>Metaverse Radio</Itemtext>
      </Item>

      <Item href='' target='_blank' rel='noopener noreferrer'>
        <ItemIcon src={LinkedIn} />
        <Itemtext>Linked In Metaverse</Itemtext>
      </Item>
    </Wrapper>
  )
}
