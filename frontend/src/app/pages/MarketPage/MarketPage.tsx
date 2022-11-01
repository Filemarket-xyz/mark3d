import React from 'react'
import { styled } from '../../../styles'
import { PageLayout } from '../../UIkit/PageLayout'
import cardImg from './img/cardImg.jpg'

// const myAnim = keyframes({
//   '0%': { bottom: '-48px' },
//   '100%': { bottom: '0' }
// })

const CardControls = styled('div', {
  width: '100%',
  borderRadius: 'inherit',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  backgroundColor: '$white',
  height: '144px',
  position: 'absolute',
  left: 0,
  right: 0,
  transform: 'translateY(0)',
  transition: 'all 0.25s ease-in-out',
  bottom: '-48px'
})

const styles: any = {
  maxWidth: '255px',
  height: '320px',
  borderRadius: '$3',
  position: 'relative',
  overflow: 'hidden'
}
styles[`&:hover ${CardControls.selector}`] = {
  transform: 'translateY(-48px)'
}

const MarketCard = styled('div', styles)

const CardImg = styled('img', {
  width: '100%',
  height: '255px',
  borderRadius: 'inherit',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  border: '1px solid rgba(255, 255, 255, 0.5)'
})

export default function MarketPage() {
  return (
    <PageLayout>
      <MarketCard>
        <CardImg src={cardImg} />
        <CardControls></CardControls>
      </MarketCard>
    </PageLayout>
  )
}
