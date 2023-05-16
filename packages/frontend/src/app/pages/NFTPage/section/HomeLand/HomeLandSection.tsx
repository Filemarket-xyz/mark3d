import React from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useCollectionStore } from '../../../../hooks/useCollectionStore'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Badge, gradientPlaceholderImg, NavLink } from '../../../../UIkit'
import { getHttpLinkFromIpfsString } from '../../../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../../../utils/nfts/reduceAddress'
import { Params } from '../../../../utils/router/Params'
import { GridBlock } from '../../helper/styles/style'

const BadgesContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$3',
  '@sm': {
    flexDirection: 'column-reverse',
    gap: '$2'
  }
})

const HomeLandSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const { collection } = useCollectionStore(collectionAddress)
  return (
    <GridBlock>
      <BadgesContainer>
        <NavLink
          mdFullWidth
          to={
            collection?.address
              ? `/collection/${collection?.address}`
              : location.pathname
          }
        >
          <Badge
            content={{ title: 'Collection', value: collection?.name ?? '' }}
            image={{
              url: collection?.image
                ? getHttpLinkFromIpfsString(collection.image)
                : gradientPlaceholderImg,
              borderRadius: 'roundedSquare'
            }}
          />
        </NavLink>
        <NavLink
          mdFullWidth
          to={collection?.creator ? `/profile/${collection?.creator}` : location.pathname}
        >
          <Badge
            image={{
              borderRadius: 'circle',
              url: getProfileImageUrl(collection?.creator ?? '')
            }}
            content={{
              title: 'Creator',
              value: reduceAddress(collection?.creator ?? '')
            }}
          />
        </NavLink>
        <NavLink
          mdFullWidth
          to={token?.owner ? `/profile/${token?.owner}` : location.pathname}
        >
          <Badge
            image={{
              borderRadius: 'circle',
              url: getProfileImageUrl(token?.owner ?? '')
            }}
            content={{
              title: 'Owner',
              value: reduceAddress(token?.owner ?? '')
            }}
          />
        </NavLink>
      </BadgesContainer>
    </GridBlock>
  )
}

export default HomeLandSection
