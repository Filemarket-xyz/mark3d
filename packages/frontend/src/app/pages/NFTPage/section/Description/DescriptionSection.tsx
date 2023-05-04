import React from 'react'
import { useParams } from 'react-router-dom'

import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Params } from '../../../../utils/router/Params'
import { GridBlock, P, PropertyTitle } from '../../helper/styles/style'

const DescriptionSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  return (
            <GridBlock>
            <PropertyTitle>Description</PropertyTitle>
            <P>{token?.description ?? 'Description is missing'}</P>
            </GridBlock>
  )
}

export default DescriptionSection
