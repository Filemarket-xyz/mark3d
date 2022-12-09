import React from 'react'
import { styled } from '../../../../styles'
import { textVariant } from '../../../UIkit'

// technology icons
import item1 from '../img/TechnologyStack/1.svg'
import item2 from '../img/TechnologyStack/2.svg'
import item3 from '../img/TechnologyStack/3.svg'
import item4 from '../img/TechnologyStack/4.png'
import item5 from '../img/TechnologyStack/5.svg'
import item6 from '../img/TechnologyStack/6.svg'
import item7 from '../img/TechnologyStack/7.png'
import item8 from '../img/TechnologyStack/8.png'
import item9 from '../img/TechnologyStack/9.png'

const Wrapper = styled('div', {
  maxWidth: 730,
  background: 'rgba(255, 255, 255, 0.15)',
  border: '4px solid transparent',
  borderRadius: 24,
  backdropFilter: 'blur(45px)',
  marginTop: '$4',
  padding: '$3 $4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  '@lg': {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

const Title = styled('h4', {
  color: '$white',
  ...textVariant('h4').true,
  fontSize: 24
})

const ItemsContainer = styled('div', {
  display: 'flex',
  gap: 20,
  alignItems: 'center',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none'
})

const Item = styled('img', {
  objectFit: 'contain',
  height: 40,
  width: 'min-content',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)'
  }
})

export const TechnologyStack = () => {
  return (
    <Wrapper>
      <Title>Technology stack</Title>
      <ItemsContainer>
        <Item src={item1} />
        <Item src={item2} />
        <Item src={item3} />
        <Item src={item4} />
        <Item src={item5} />
        <Item src={item6} />
        <Item src={item7} />
        <Item src={item8} />
        <Item src={item9} />
      </ItemsContainer>
    </Wrapper>
  )
}
