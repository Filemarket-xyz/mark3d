import React from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { textVariant } from '../../../../UIkit'
import { Params } from '../../../../utils/router/Params'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'

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

const Pre = styled('pre', {
  ...textVariant('body4').true,
  color: '$gray800',
  fontWeight: 400,
  whiteSpace: '-moz-pre-wrap', /* Mozilla, supported since 1999 */
  // eslint-disable-next-line no-dupe-keys
  whiteSpace: '-pre-wrap', /* Opera */
  // eslint-disable-next-line no-dupe-keys
  whiteSpace: '-o-pre-wrap', /* Opera */
  // eslint-disable-next-line no-dupe-keys
  whiteSpace: 'pre-wrap', /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
  wordWrap: 'break-word' /* IE 5.5+ */
})

const DescriptionSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)

  return (
    <>
      {token?.description && (
        <DescriptionSectionStyle style={{ gridArea: 'Description' }}>
          <PropertyTitle>Description</PropertyTitle>
          <Pre>{token?.description}</Pre>
        </DescriptionSectionStyle>
      )}
    </>
  )
}

export default DescriptionSection
