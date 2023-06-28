import React, { FC } from 'react'

import { styled } from '../../../../../../styles'
import { textVariant } from '../../../../../UIkit'

const PropertiesCardStyle = styled('div', {
  width: '218px',
  height: '108px',
  border: '1px solid #eaeaea',
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const TopText = styled('h5', {
  ...textVariant('primary2').true,
  color: '#7B7C7E',
})

const RareText = styled('h5', {
  ...textVariant('primary2').true,
  color: '$gray800',
  textAlign: 'center',
  whiteSpace: 'break-spaces',
})

const ChanceText = styled('h5', {
  ...textVariant('secondary2').true,
  color: '#656669',
})

export interface PropertiesCardProps {
  type?: string
  rare?: string
  chance?: string
  maxValue?: number
  minValue?: number
}

const PropertiesCard: FC<PropertiesCardProps> = ({ type, rare, chance, maxValue, minValue }) => {
  return (
    <PropertiesCardStyle>
      {type && <TopText>{type}</TopText>}
      <RareText>{rare}</RareText>
      <ChanceText>
        {(minValue && maxValue) && `${((minValue / maxValue) * 100).toFixed(2)}% have this property`}
      </ChanceText>
    </PropertiesCardStyle>
  )
}

export default PropertiesCard
