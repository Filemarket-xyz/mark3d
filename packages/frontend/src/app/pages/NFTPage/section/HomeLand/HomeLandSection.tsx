import React from 'react'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../../styles'
import { useCollectionStore } from '../../../../hooks/useCollectionStore'
import { useTokenStore } from '../../../../hooks/useTokenStore'
import { Badge, gradientPlaceholderImg, NavLink } from '../../../../UIkit'
import { getHttpLinkFromIpfsString } from '../../../../utils/nfts/getHttpLinkFromIpfsString'
import { getProfileImageUrl } from '../../../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../../../utils/nfts/reduceAddress'
import { Params } from '../../../../utils/router'
import { GridBlock } from '../../helper/styles/style'

const BadgesContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
  '@sm': {
    flexDirection: 'column-reverse',
  },
})

const HomeLandSection = () => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const { collection } = useCollectionStore(collectionAddress)

  return (
    <GridBlock style={{ gridArea: 'HomeLand' }}>
      <BadgesContainer>
        <NavLink
          lgFullWidth
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
              borderRadius: 'roundedSquare',
            }}
            wrapperProps={{
              nftPage: true,
            }}
          />
        </NavLink>
        <NavLink
          lgFullWidth
          to={collection?.creator ? `/profile/${collection?.creator}` : location.pathname}
        >
          <Badge
            image={{
              borderRadius: 'circle',
              url: getProfileImageUrl(collection?.creator ?? ''),
            }}
            content={{
              title: 'Creator',
              value: reduceAddress(collection?.creator ?? ''),
            }}
            wrapperProps={{
              nftPage: true,
            }}
          />
        </NavLink>
        <NavLink
          lgFullWidth
          to={token?.owner ? `/profile/${token?.owner}` : location.pathname}
        >
          <Badge
            image={{
              borderRadius: 'circle',
              url: getProfileImageUrl(token?.owner ?? ''),
            }}
            content={{
              title: 'Owner',
              value: reduceAddress(token?.owner ?? ''),
            }}
            wrapperProps={{
              nftPage: true,
            }}
          />
        </NavLink>
      </BadgesContainer>
    </GridBlock>
  )
}

export default HomeLandSection
