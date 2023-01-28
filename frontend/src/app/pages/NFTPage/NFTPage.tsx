import React, { useMemo } from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant, NavLink, Badge, gradientPlaceholderImg } from '../../UIkit'
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
import { useIsOwner } from '../../processing/hooks'
import { transferPermissions } from '../../utils/transfer/status'
import '@google/model-viewer'
import { PreviewNFTFlow } from './components/PreviewNFTFlow'
import { FileButton } from '../../components/NFT/FileButton'
import { ProtectedStamp } from '../../components/NFT/FileButton/ProtectedStamp'

const NFTPreviewContainer = styled('div', {
  width: '100%',
  height: 700,
  '@md': {
    height: 500
  },
  background: '$gradients$main',
  paddingTop: 'calc($layout$navBarHeight)',
  paddingBottom: '$6',
  boxSizing: 'content-box'
})

const NftName = styled('h1', {
  ...textVariant('h3').true,
  fontWeight: '600',
  color: '$gray800',
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
  borderRadius: '$6 $6 0 0',
  position: 'relative',
  top: '-$6',
  '&:after': {
    display: 'block',
    content: '',
    position: 'absolute',
    bottom: '-$6',
    left: 0,
    right: 0,
    height: '$space$6',
    backgroundColor: '$gray100'
  },
  boxShadow: '$footer',
  '@md': {
    borderRadius: '$4 $4',
    gridTemplateRows: 'max-content',
    gap: '$5',
    gridTemplateColumns: '1fr'
  }
})

const GridBlock = styled('div')

const PropertyTitle = styled('h2', {
  ...textVariant('h5').true,
  color: '$gray800',
  marginBottom: '$3'
})

const P = styled('p', {
  ...textVariant('body4').true,
  color: '$gray800',
  fontWeight: 400
})

const StyledHr = styled(Hr, {
  marginBottom: '$3'
})

const FileList = styled('div', {
  '& li:not(:last-child)': {
    marginBottom: '$2'
  }
})

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
        {
          <PreviewNFTFlow
            getFile={files[0]?.getFile}
            canViewFile={isOwner || canViewHiddenFiles}
            imageURL={getHttpLinkFromIpfsString(token?.image ?? '')}
          />
        }
      </NFTPreviewContainer>

      <GridLayout>
        <GridBlock>
          <NftName>{token?.name}</NftName>
          <BadgesContainer>
            <NavLink
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
            >
              <NavLink
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
            </NFTDeal>
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
          <FileList>
            {isOwner || canViewHiddenFiles ? (
              files.map(({ cid, name, size, download }) => (
                <ProtectedStamp key={cid}>
                  <FileButton
                    name={name}
                    caption={`download (${formatFileSize(size)})`}
                    onPress={download}
                  />
                </ProtectedStamp>
              ))
            ) : (
              <ProtectedStamp>
                <FileButton
                  name="Available only"
                  caption="to the owner"
                  isDisabled={true}
                />
              </ProtectedStamp>
            )}
          </FileList>
        </GridBlock>
      </GridLayout>
    </>
  )
})

export default NFTPage
