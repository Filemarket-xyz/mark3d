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
}

const PropertiesSection: FC<PropertiesProps> = ({ properties }) => {
  return (
    <>
      {(properties && properties.length > 0) && (
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
                    maxValue={property.traitTotal}
                    minValue={property.traitValueCount}
                  />
                )
              })}
            </div>
          </PropertiesStyle>
        </GridBlock>
      )}
    </>
  )
}

export default PropertiesSection
