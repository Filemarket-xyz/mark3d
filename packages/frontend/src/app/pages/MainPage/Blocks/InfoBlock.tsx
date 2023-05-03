import React from 'react'
import { styled } from '../../../../styles'
import KeepUpDate from '../components/KeepUpDate/KeepUpDate'

const InfoBlockContainer = styled('div', {
  paddingTB: '160px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  paddingLR: 'calc((100% - $breakpoints$xl) * 0.22 + $space$4)',
  '@xl': {
    paddingLR: 'calc((100% - $breakpoints$lg) * 0.42 + $space$4)'
  },
  '@lg': {
    paddingLR: 'calc((100% - $breakpoints$md) * 0.42 + $space$4)'
  },
  '@md': {
    paddingLR: 'calc((100% - $breakpoints$sm) * 0.42 + $space$3)'
  },
  '@sm': {
    paddingLR: '$3'
  }
})

const InfoBlock = () => {
  return (
    <InfoBlockContainer>
      <KeepUpDate/>
    </InfoBlockContainer>
  )
}

export default InfoBlock
