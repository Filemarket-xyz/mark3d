import React, { FC } from 'react'

import { styled } from '../../../../../../styles'
import { textVariant } from '../../../../../UIkit'

const PropertiesCardStyle = styled('div', {
  width: '218px',
  height: '108px',
  border: '1px solid #eaeaea',
  borderRadius: '16px',
  padding: '16px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  justifyContent: 'center',
  alignItems: 'center'
})

const TopText = styled('h5', {
  ...textVariant('primary2').true,
  color: '#7B7C7E'
})

const RareText = styled('h5', {
  ...textVariant('primary2').true,
  color: '$gray800'
})

const ChanceText = styled('h5', {
  ...textVariant('secondary2').true,
  color: '#656669'
})

export interface PropertiesCardProps {
  type: string
  rare: string
  chance: string
}

const PropertiesCard: FC<PropertiesCardProps> = ({ type, rare, chance }) => {
  return (
        <PropertiesCardStyle>
            <TopText>{type}</TopText>
            <RareText>{rare}</RareText>
            <ChanceText>{chance}% have this property</ChanceText>
        </PropertiesCardStyle>
  )
}

export default PropertiesCard
