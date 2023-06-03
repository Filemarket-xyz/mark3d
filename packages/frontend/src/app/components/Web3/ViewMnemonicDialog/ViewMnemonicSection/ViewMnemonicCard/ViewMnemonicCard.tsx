import React from 'react'

import { styled } from '../../../../../../styles'
import { Txt } from '../../../../../UIkit'

const ViewMnemonicCardStyle = styled('div', {
  border: '1px solid $gray400',
  width: '100%',
  height: '56px',
  borderRadius: '12px',
  display: 'flex',
  gap: '58px',
  alignItems: 'center',
  padding: '12px 18px',
  position: 'relative',
  justifyContent: 'center',
})

interface ViewMnemonicCardProps {
  number: number
  word: string
}

const ViewMnemonicCard = ({ number, word }: ViewMnemonicCardProps) => {
  return (
    <ViewMnemonicCardStyle>
      <Txt
        primary1
        style={{
          fontWeight: 600,
          color: '#A7A8A9',
          position: 'absolute',
          left: '12px',
        }}
      >
        {number}
      </Txt>
      <Txt
        primary1
        style={{
          fontWeight: 600,
          color: '#232528',
        }}
      >
        {word}
      </Txt>
    </ViewMnemonicCardStyle>
  )
}

export default ViewMnemonicCard
