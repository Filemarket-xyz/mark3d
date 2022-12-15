import React from 'react'
import { styled } from '../../../../styles'
import { textVariant, ToolCard, ToolCardGradientBorder } from '../../../UIkit'

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

const Title = styled('h4', {
  color: '$white',
  ...textVariant('h4').true,
  fontSize: 24
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

const Item = styled('img', {
  objectFit: 'contain',
  height: 38,
  width: 'min-content',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)'
  }
})

export const TechnologyStack = () => {
  return (
    <ToolCardWide>
      <ToolCardGradientBorder>
        <ToolCardContent>
          <Title>Technology stack</Title>
          <ItemsContainer>
            <Item src={item1}/>
            <Item src={item2}/>
            <Item src={item3}/>
            <Item src={item4}/>
            <Item src={item5}/>
            <Item src={item6}/>
            <Item src={item7}/>
            <Item src={item8}/>
            <Item src={item9}/>
          </ItemsContainer>
        </ToolCardContent>
      </ToolCardGradientBorder>
    </ToolCardWide>
  )
}
