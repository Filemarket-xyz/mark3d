import React from 'react'
import { styled } from '../../../../styles'
import { textVariant, ToolCard } from '../../../UIkit'

// technology icons
import item1 from '../img/TechnologyStack/1.svg'
import item2 from '../img/TechnologyStack/2.svg'
import item3 from '../img/TechnologyStack/3.svg'
import item4 from '../img/TechnologyStack/4.png'
import item5 from '../img/TechnologyStack/5.svg'
import item6 from '../img/TechnologyStack/6.svg'
import worlds from '../img/TechnologyStack/worlds.svg'
import lighthouse from '../img/TechnologyStack/lighthouse.svg'
import peeranha from '../img/TechnologyStack/peeranha.svg'

const ToolCardWide = styled(ToolCard, {
  maxWidth: 730,
  marginTop: '$4',
  '@lg': {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  '@sm': {
    width: '90%'
  }
})

const ToolCardContent = styled('div', {
  padding: '$3 $4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3'
})

const Title = styled('h5', {
  color: '$white',
  ...textVariant('h5').true
})

const ItemsContainer = styled('div', {
  display: 'flex',
  gap: 18,
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none'
})

const Item = styled('a', {
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)'
  }
})

const ItemImg = styled('img', {
  objectFit: 'contain',
  height: 38,
  width: 'min-content'
})

interface ItemData {
  src: string
  href: string
}

const items: ItemData[] = [
  {
    src: item1,
    href: 'https://ethereum.org/'
  },
  {
    src: item2,
    href: 'https://polygon.technology/'
  },
  {
    src: item3,
    href: 'https://filecoin.io/'
  },
  {
    src: item4,
    href: 'https://fvm.filecoin.io/'
  },
  {
    src: item5,
    href: 'https://ipfs.tech/'
  },
  {
    src: item6,
    href: 'https://ipld.io/'
  },
  {
    src: lighthouse,
    href: 'https://www.lighthouse.storage/'
  },
  {
    src: worlds,
    href: 'https://w3rlds.com/'
  },
  {
    src: peeranha,
    href: 'https://peeranha.io/'
  }
]

export const TechnologyStack = () => {
  return (
    <ToolCardWide>
      <ToolCardContent>
        <Title>Powered by</Title>
        <ItemsContainer>
          {items.map(({ src, href }) => (
            <Item key={src} href={href} target='_blank'>
              <ItemImg src={src}/>
            </Item>
          ))}
        </ItemsContainer>
      </ToolCardContent>
    </ToolCardWide>
  )
}
