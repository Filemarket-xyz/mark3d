import React from 'react'

import { styled } from '../../../../styles'
import HowToGetStart from '../components/HowToGetStart/HowToGetStart'
import KeepUpDate from '../components/KeepUpDate/KeepUpDate'

const InfoBlockContainer = styled('div', {
  paddingTB: '160px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  background: 'linear-gradient(90deg, #38BCC9 0%, #088DFA 100%)',
  paddingLR: 'calc((100% - $breakpoints$xl) * 0.22 + $space$4)',
  '@xl': {
    paddingLR: 'calc((100% - $breakpoints$lg) * 0.42 + $space$4)'
  },
  '@lg': {
    paddingLR: 'calc((100% - $breakpoints$md) * 0.42 + $space$4)',
    paddingTB: '128px'
  },
  '@md': {
    paddingLR: 'calc((100% - $breakpoints$sm) * 0.42 + $space$3)',
    paddingTB: '96px'
  },
  '@sm': {
    paddingLR: '$3',
    paddingTB: '48px'
  }
})

const InfoBlock = () => {
  return (
    <InfoBlockContainer>
      <HowToGetStart />
      <KeepUpDate />
    </InfoBlockContainer>
  )
}

export default InfoBlock
