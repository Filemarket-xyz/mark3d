import React from 'react'

import { styled } from '../../../../styles'
import { Container } from '../../../UIkit'
import Card from '../components/Card/Card'
import { CardBlackOptions, CardGradientOptions, CardWhiteOptions } from '../helper/Card/data'

const CardsBlockContainer = styled(Container, {
  paddingTB: '160px',
  '@lg': {
    paddingTB: '128px'
  },
  '@md': {
    paddingTB: '96px'
  },
  '@sm': {
    paddingTB: '48px'
  }
})

const WhiteBlock = styled('div', {
  width: '100%',
  height: '100%'
})

const BlackBlock = styled('div', {
  width: '100%',
  height: '100%',
  background: '#131416'
})

const GradientBlock = styled('div', {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(291.31deg, #0291FC 0%, #4AC6D1 100%)'

})

const CardsBlockInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '208px',
  '@lg': {
    gap: '120px'
  },
  '@md': {
    gap: '80px'
  },
  '@sm': {
    gap: '40px'
  }
})

const CardsBlock = () => {
  return (<>
      <WhiteBlock>
        <CardsBlockContainer>
          <CardsBlockInfo>
            {CardWhiteOptions.map((item, index) => {
              return <Card cardType={item.cardType} headerText={item.headerText} img={item.img} text={item.text}
                           rightBottomContent={item.rightBottomContent} isImgRight={item.isImgRight} linear={item.linear} key={index} />
            })}
          </CardsBlockInfo>
        </CardsBlockContainer>
      </WhiteBlock>
      <BlackBlock>
        <CardsBlockContainer>
          <CardsBlockInfo>
            {CardBlackOptions.map((item, index) => {
              return <Card theme={'black'} cardType={item.cardType} headerText={item.headerText} img={item.img}
                           text={item.text} rightBottomContent={item.rightBottomContent} isImgRight={item.isImgRight}
                           key={index} />
            })}
          </CardsBlockInfo>
        </CardsBlockContainer>
      </BlackBlock>
      <GradientBlock>
        <CardsBlockContainer>
          <CardsBlockInfo>
            {CardGradientOptions.map((item, index) => {
              return <Card cardType={item.cardType} headerText={item.headerText} img={item.img}
                           text={item.text} rightBottomContent={item.rightBottomContent} isImgRight={item.isImgRight}
                           key={index} />
            })}
          </CardsBlockInfo>
        </CardsBlockContainer>
      </GradientBlock>
    </>
  )
}

export default CardsBlock
