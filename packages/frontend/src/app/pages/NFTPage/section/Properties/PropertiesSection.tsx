import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'
import PropertiesCard, { PropertiesCardProps } from './PropertiesCard/PropertiesCard'

const PropertiesStyle = styled('div', {
  width: '100%',
  '& .overflow': {
    width: '100%',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  '@lg': {
    overflowX: 'scroll',
    '& .overflow': {
      width: 'max-content'
    }
  }
})

interface PropertiesProps {
  properties: PropertiesCardProps[]
}

const PropertiesSection: FC<PropertiesProps> = ({ properties }) => {
  return (
    <GridBlock>
      <PropertyTitle>Properties</PropertyTitle>
      <PropertiesStyle>
        <div className="overflow">
          {properties.map((property) => {
            return (
              <PropertiesCard
                key={property.type}
                type={property.type}
                rare={property.rare}
                chance={property.chance}
              />
            )
          })}
        </div>
      </PropertiesStyle>
    </GridBlock>
  )
}

export default PropertiesSection
