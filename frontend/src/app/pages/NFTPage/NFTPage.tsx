import React, { useMemo } from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant, Link, Txt, NavLink } from '../../UIkit'
import Badge from '../../components/Badge/Badge'
import { Hr } from '../../UIkit/Hr/Hr'
import { NFTDeal } from '../../components/NFT'
import { observer } from 'mobx-react-lite'
import { useLocation, useParams } from 'react-router-dom'
import { Params } from '../../utils/router/Params'
import { makeTokenFullId } from '../../processing/utils/id'
import { useTransferStoreWatchEvents } from '../../hooks/useTransferStoreWatchEvents'
import { useOrderStore } from '../../hooks/useOrderStore'
import { useCollectionStore } from '../../hooks/useCollectionStore'
import { getProfileImageUrl } from '../../utils/nfts/getProfileImageUrl'
import { reduceAddress } from '../../utils/nfts/reduceAddress'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { useHiddenFileDownload } from '../../hooks/useHiddenFilesDownload'
import { useStores } from '../../hooks'
import { useTokenStore } from '../../hooks/useTokenStore'
import { useTokenMetaStore } from '../../hooks/useTokenMetaStore'
import { formatFileSize } from '../../utils/nfts/formatFileSize'
import gradientBg from '../ProfilePage/img/Gradient.jpg'
import { useIsOwner } from '../../processing/hooks'
import { transferPermissions } from '../../utils/transfer/status'
import { gradientPlaceholderImg } from '../../components/Placeholder/GradientPlaceholder'

const NFTPreviewContainer = styled('div', {
  width: '100%',
  // TODO height will be set by 3d previewer
  height: 400,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundImage: `url(${gradientBg})`,
  paddingTop: '$layout$navBarHeight'
})

const NftName = styled('h1', {
  ...textVariant('h3').true,
  color: '$blue900',
  marginBottom: '$4'
})

const BadgesContainer = styled('div', {
  display: 'flex',
  gap: '$3',
  '@sm': {
    flexDirection: 'column-reverse',
    gap: '$2'
  }
})

const GridLayout = styled(PageLayout, {
  paddingTB: 48,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'max-content',
  columnGap: '$4',
  minHeight: '100%',
  gap: '48px',
  '@md': {
    gridTemplateRows: 'max-content',
    gap: '$5',
    gridTemplateColumns: '1fr'
  }
})

const GridBlock = styled('div')

const PropertyTitle = styled('h2', {
  ...textVariant('h5').true,
  color: '$gray500',
  marginBottom: '$3'
})

const P = styled('p', {
  ...textVariant('primary1').true,
  color: '$gray500',
  fontWeight: 400
})

const StyledHr = styled(Hr, {
  marginBottom: '$3'
})

const Ul = styled('ul', {
  listStyle: 'inside'
})

// collection address and token id dev example
// { collectionAddress: '0xe37382f84dc2c72ef7eaac6e327bba054b30628c', tokenId: '0' }

const NFTPage = observer(() => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const tokenFullId = useMemo(
    () => makeTokenFullId(collectionAddress, tokenId),
    [collectionAddress, tokenId]
  )
  const transferStore = useTransferStoreWatchEvents(collectionAddress, tokenId)
  const orderStore = useOrderStore(collectionAddress, tokenId)
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const tokenMetaStore = useTokenMetaStore(token?.metaUri)
  const { errorStore } = useStores()
  const files = useHiddenFileDownload(tokenMetaStore, errorStore, token)
  const { isOwner } = useIsOwner(tokenFullId)
  const canViewHiddenFiles = transferPermissions.buyer.canViewHiddenFiles(
    transferStore.data
  )

  const { collection } = useCollectionStore(collectionAddress)
  const location = useLocation()

  return (
    <>
      <NFTPreviewContainer>
        {(isOwner || canViewHiddenFiles) && (
          <model-viewer
            src={getHttpLinkFromIpfsString(token?.hiddenFile ?? '')}
            ar
            shadow-intensity='1'
            camera-controls
            touch-action='pan-y'
            style={{ width: '100%', height: '100%' }}
          ></model-viewer>
        )}
      </NFTPreviewContainer>

      <GridLayout>
        <GridBlock>
          <NftName>{token?.name}</NftName>
          <BadgesContainer>
            <NavLink
              to={token?.owner ? `/profile/${token?.owner}` : location.pathname}
            >
              <Badge
                image={{
                  borderRadius: 'circle',
                  url: getProfileImageUrl(token?.owner ?? '')
                }}
                content={{
                  title: 'Creator',
                  value: reduceAddress(token?.creator ?? '')
                }}
              />
            </NavLink>

            <NavLink
              to={
                collection?.address
                  ? `/collection/${collection?.address}`
                  : location.pathname
              }
            >
              <Badge
                image={{
                  url: collection?.image
                    ? getHttpLinkFromIpfsString(collection.image)
                    : gradientPlaceholderImg,
                  borderRadius: 'roundedSquare'
                }}
                content={{ title: 'Collection', value: collection?.name ?? '' }}
              />
            </NavLink>
          </BadgesContainer>
        </GridBlock>

        <GridBlock>
          {tokenFullId && (
            <NFTDeal
              transfer={transferStore.data}
              order={orderStore.data}
              tokenFullId={tokenFullId}
              reFetchOrder={() => {
                orderStore.reload()
                transferStore.reload()
              }}
            />
          )}
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Description</PropertyTitle>
          <StyledHr />
          <P>{token?.description}</P>
        </GridBlock>

        <GridBlock>
          <PropertyTitle>Hidden files</PropertyTitle>
          <StyledHr />
          <Ul
            css={{
              listStyle: 'none',
              '& li:not(:last-child)': {
                marginBottom: '$2'
              }
            }}
          >
            {isOwner || canViewHiddenFiles ? (
              files.map(({ cid, name, size, download }) => (
                <li key={cid}>
                  <Link onPress={download} gray>
                    {name}
                  </Link>
                  {size > 0 && (
                    <Txt secondary2 css={{ color: '$gray500' }}>
                      {` (${formatFileSize(size)})`}
                    </Txt>
                  )}
                </li>
              ))
            ) : (
              <Txt secondary2 css={{ color: '$gray500' }}>
                Hidden files are only shown to the owner
              </Txt>
            )}
          </Ul>
        </GridBlock>
      </GridLayout>
    </>
  )
})

export default NFTPage
