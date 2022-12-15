import React from 'react'
import { styled } from '../../../../styles'
import { Link } from '../../../UIkit'

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

const LinkStyled = styled(Link, {
  display: 'flex',
  alignItems: 'center'
})

const LinkIcon = styled('img', {
  width: 18,
  height: 18,
  marginRight: '$1',
  display: 'inline-block'
})

interface LinkData {
  name: string
  href: string
  src: string
}

const links: LinkData[] = [
  {
    name: 'MetaTwitter',
    href: 'https://twitter.com/mark3d_xyz',
    src: Twitter
  },
  {
    name: 'Telegram for Metaverse builders',
    href: 'https://t.me/mark3d_xyz',
    src: Telegram
  },
  {
    name: 'Metaverse Review',
    href: 'https://medium.com/@mark3d',
    src: Medium
  },
  {
    name: 'The Metaversed Podcast',
    href: 'https://anchor.fm/the-metaversed',
    src: Anchor
  },
  {
    name: 'The Metaverse TV',
    href: 'https://youtube.com/@mark3d',
    src: Youtube
  },
  {
    name: 'Metaverse Radio',
    href: 'https://t.me/Metaverse_Radio',
    src: Telegram
  },
  {
    name: 'Linked In Metaverse',
    href: 'https://linkedin.com/company/mark3dxyz/',
    src: LinkedIn
  }
]

export const LinksBanner = () => {
  return (
    <Wrapper>
      {links.map(({ name, href, src }) => (
        <LinkStyled
          key={href}
          href={href}
          target='_blank'
          small
          white
          underlined
        >
          <LinkIcon src={src} alt={name}/>
          {name}
        </LinkStyled>
      ))}
    </Wrapper>
  )
}
