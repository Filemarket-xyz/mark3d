import React from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Params } from '../../../../utils/router/Params'
import { GridBlock, P, PropertyTitle } from '../../helper/styles/style'

const DescriptionSectionStyle = styled(GridBlock, {
  paddingTop: '32px',
  paddingBottom: '32px',
  '@md': {
    paddingTop: '16px',
    paddingBottom: '16px'
  },
  '@sm': {
    paddingTop: '8px',
    paddingBottom: '8px'
  }
})

const DescriptionSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)

  return (
    <>
      {token?.description && (
        <DescriptionSectionStyle style={{ gridArea: 'Description' }}>
          <PropertyTitle>Description</PropertyTitle>
          <P>{token?.description}</P>
        </DescriptionSectionStyle>
      )}
    </>
  )
}

export default DescriptionSection
