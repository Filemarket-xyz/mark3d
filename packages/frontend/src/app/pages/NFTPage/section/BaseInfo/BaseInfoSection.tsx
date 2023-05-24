import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Link, textVariant } from '../../../../UIkit'
import { Params } from '../../../../utils/router/Params'
import { GridBlock, PropertyTitle } from '../../helper/styles/style'

const NftName = styled('h1', {
  ...textVariant('h3').true,
  fontWeight: '600',
  color: '$gray800',
  marginBottom: '$3'
})

export const NftLicence = styled('span', {
  display: 'flex',
  gap: '4px',
  marginTop: '$2'
})

const BaseInfoSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const transactionUrl: string = useMemo(() => {
    return `https://filfox.info/en/message/${token?.mintTxHash}`
  }, [token?.mintTxHash])

  return (
    <GridBlock style={{ gridArea: 'BaseInfo' }}>
      <NftName>{token?.name}</NftName>
      {token?.mintTxTimestamp && (
        <Link
          iconRedirect
          href={transactionUrl ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
          target="_blank"
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          Minted on
          {' '}
          {new Date(token?.mintTxTimestamp * 1000).toDateString().substring(4)}
        </Link>
      )}
      {token?.license && (
        <NftLicence>
          <PropertyTitle style={{ fontSize: '14px', lineHeight: '20px', marginBottom: '0' }}>License: </PropertyTitle>
          <Link
            iconRedirect
            href={'https://creativecommons.org/licenses/'}
            target="_blank"
            style={{ fontSize: '14px', lineHeight: '20px' }}
          >
            {token?.license}
          </Link>
        </NftLicence>
      )}
    </GridBlock>
  )
}

export default BaseInfoSection
