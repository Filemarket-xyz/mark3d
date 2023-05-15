import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Link, textVariant } from '../../../../UIkit'
import { Params } from '../../../../utils/router/Params'
import { GridBlock } from '../../helper/styles/style'

const NftName = styled('h1', {
  ...textVariant('h3').true,
  fontWeight: '600',
  color: '$gray800',
  marginBottom: '$2'
})

export const NftLicence = styled('h5', {
  marginTop: '$3',
  '@md': {
    marginTop: '$2'
  }
})

const BaseInfoSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const transactionUrl: string = useMemo(() => {
    return `https://filfox.info/en/message/${token?.mintTxHash}`
  }, [token?.mintTxHash])
  return (
        <GridBlock>
            <NftName>{token?.name}</NftName>
             {token?.mintTxTimestamp &&
               <Link href={transactionUrl ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} target="_blank">Minted on {new Date(token?.mintTxTimestamp * 1000).toDateString().substring(4)}</Link>}
            {token?.license && <NftLicence>License: <Link iconRedirect href={'https://creativecommons.org/licenses/'} target="_blank">{token?.license}</Link></NftLicence>}
        </GridBlock>
  )
}

export default BaseInfoSection
