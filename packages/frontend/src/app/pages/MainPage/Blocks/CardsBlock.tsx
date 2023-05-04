import React from 'react'

import { styled } from '../../../../styles'
import { Container } from '../../../UIkit'
import Card from '../components/Card/Card'
import { CardBlackOptions, CardWhiteOptions } from '../helper/Card/data'

const CardsBlockContainer = styled(Container, {
  paddingTB: '160px'
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

const CardsBlockInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '208px'
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
    </>
  )
}

export default CardsBlock
