import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { MetadataProperty } from '../../../../../swagger/Api'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'
import PropertiesCard from './PropertiesCard/PropertiesCard'

const PropertiesStyle = styled('div', {
  width: '100%',
  '& .overflow': {
    width: '100%',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  '@lg': {
    width: '400px',
    overflowX: 'scroll',
    '& .overflow': {
      width: 'max-content',
    },
  },
  '@md': {
    width: '560px',
  },
  '@sm': {
    width: '92vw',
  },
})

interface PropertiesProps {
  properties?: MetadataProperty[]
  rankings?: MetadataProperty[]
}

const PropertiesSection: FC<PropertiesProps> = ({ properties, rankings }) => {
  return (
    <GridBlock style={{ gridArea: 'Properties' }}>
      <PropertyTitle>Properties</PropertyTitle>
      <PropertiesStyle>
        <div className="overflow">
          {properties?.map((property) => {
            return (
              <PropertiesCard
                key={property.traitType}
                type={property.traitType ?? ''}
                rare={property.value ?? ''}
                maxValue={property.traitTotal.toString()}
                minValue={property.traitValueCount?.toString()}
              />
            )
          })}
          {rankings?.map((property) => {
            return (
              <PropertiesCard
                key={property.traitType}
                rare={property.traitType ?? ''}
                maxValue={property.max_value?.includes(',') ? parseFloat(property.max_value ?? '0').toFixed(2) : parseInt(property.max_value ?? '0').toString()}
                minValue={property.value?.includes(',') ? parseFloat(property.value ?? '0').toFixed(2) : parseInt(property.value ?? '0').toString()}
              />
            )
          })}
        </div>
      </PropertiesStyle>
    </GridBlock>
  )
}

export default PropertiesSection
