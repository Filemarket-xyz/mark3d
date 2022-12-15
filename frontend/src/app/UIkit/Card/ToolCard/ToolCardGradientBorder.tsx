import { styled } from '../../../../styles'
import { FC, PropsWithChildren } from 'react'

import topLeft from './img/top-left.svg'
import topRight from './img/top-right.svg'
import bottomRight from './img/bottom-right.svg'
import bottomLeft from './img/bottom-left.svg'

const BorderContainer = styled('div', {
  borderImage: '$gradients$main 1',
  borderWidth: '4px',
  borderStyle: 'solid',
  height: '100%'
})

const Corner = styled('img', {
  position: 'absolute',
  width: 32,
  height: 32
})

const TopLeftCorner = styled(Corner, {
  top: 0,
  left: 0
})

const TopRightCorner = styled(Corner, {
  top: 0,
  right: 0
})

const BottomRightCorner = styled(Corner, {
  bottom: 0,
  right: 0
})

const BottomLeftCorner = styled(Corner, {
  bottom: 0,
  left: 0
})

export const ToolCardGradientBorder: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BorderContainer>
      {children}
      <TopLeftCorner src={topLeft} alt=""/>
      <TopRightCorner src={topRight} alt=""/>
      <BottomRightCorner src={bottomRight} alt=""/>
      <BottomLeftCorner src={bottomLeft} alt=""/>
    </BorderContainer>
  )
}
