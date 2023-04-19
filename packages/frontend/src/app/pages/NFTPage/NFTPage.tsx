import React, { useMemo } from 'react'
import { styled } from '../../../styles'
import { PageLayout} from '../../UIkit'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { Params } from '../../utils/router/Params'
import { makeTokenFullId } from '../../processing/utils/id'
import { useTransferStoreWatchEvents } from '../../hooks/useTransferStoreWatchEvents'
import { getHttpLinkFromIpfsString } from '../../utils/nfts/getHttpLinkFromIpfsString'
import { useHiddenFileDownload } from '../../hooks/useHiddenFilesDownload'
import { useStores } from '../../hooks'
import { useTokenStore } from '../../hooks/useTokenStore'
import { useTokenMetaStore } from '../../hooks/useTokenMetaStore'

const NFTPreviewContainer = styled('div', {
  width: '100%',
  height: 700,
  '@md': {
    height: 500
  },
  background: '$gradients$background',
  paddingTop: 'calc($layout$navBarHeight)',
  paddingBottom: '$6',
  boxSizing: 'content-box'
})

const MainInfo = styled(PageLayout, {
  paddingTB: 48,
  fontSize: '16px',
  gridTemplateColumns: '3fr 1fr',
  gridTemplateRows: 'max-content',
  columnGap: '$4',
  minHeight: '100%',
  borderRadius: '$6 $6 0 0',
  top: '-$6',
  boxShadow: '$footer'
})

const GridLayout = styled('div', {
  display: 'grid',
  gap: '3rem',
  position: 'relative',
  gridTemplateColumns: '3fr 1fr',
  gridTemplateRows: 'max-content',
  columnGap: '$4',
  minHeight: '100%',
  '@mdx': {
    display: 'flex'
  }
})

const GridBlockSection = styled(GridBlock, {
  display: 'flex',
  flexDirection: 'column',
  gap: '48px'
})

const GridBlockSectionRow = styled(GridBlockSection, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '12px',
  '@mdx': {
    flexDirection: 'column'
  }
})

const DisplayLayout = styled('div', {
  display: 'flex',
  gap: '32px',
  marginTop: '32px',
  flexDirection: 'column'
})

const NFTPage = observer(() => {
  const { collectionAddress, tokenId } = useParams<Params>()
  const transferStore = useTransferStoreWatchEvents(collectionAddress, tokenId)
  const { data: token } = useTokenStore(collectionAddress, tokenId)
  const tokenMetaStore = useTokenMetaStore(token?.metaUri)
  const { errorStore } = useStores()
  const files = useHiddenFileDownload(tokenMetaStore, errorStore, token)
  const tokenFullId = useMemo(
      () => makeTokenFullId(collectionAddress, tokenId),
      [collectionAddress, tokenId]
  )
  const { isOwner } = useIsOwner(tokenFullId)
  const isBuyer = useIsBuyer(transferStore.data)
  const canViewHiddenFiles = isBuyer && transferPermissions.buyer.canViewHiddenFiles(
    transferStore.data
  )

  const properties: PropertiesCardProps[] = [
    {
      type: 'Background',
      rare: 'Rare Gradient Background',
      chance: '7'
    },
    {
      type: 'Pattern',
      rare: 'Rare Property',
      chance: '7'
    },
    {
      type: 'Body',
      rare: 'Rare Property',
      chance: '7'
    },
    {
      type: 'Logo',
      rare: 'Rare Property',
      chance: '7'
    },
    {
      type: 'Accessories',
      rare: 'Rare Property',
      chance: '7'
    },
    {
      type: 'Foots',
      rare: 'Rare Property',
      chance: '7'
    },
    {
      type: 'Pet',
      rare: 'Rare Gradient Background',
      chance: '7'
    }
  ]

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
      <MainInfo>
        <GridLayout>
          <GridBlockSection>
            <BaseInfoSection/>
            {window.innerWidth <= 900 && <GridBlockSectionRow>
              <ControlSection/>
              <FileInfoSection isOwner={isOwner} canViewHiddenFiles={canViewHiddenFiles} files={files}/>
            </GridBlockSectionRow>}
            <HomeLandSection/>
            <TagsSection/>
            {window.innerWidth > 1200 && <><DescriptionSection/>
              <PropertiesSection properties={properties}/></>}
          </GridBlockSection>

          {window.innerWidth > 900 && <GridBlockSection>
            <ControlSection/>
            <FileInfoSection isOwner={isOwner} canViewHiddenFiles={canViewHiddenFiles} files={files}/>
          </GridBlockSection>}
        </GridLayout>

        {window.innerWidth <= 1200 && <DisplayLayout><DescriptionSection/>
        <PropertiesSection properties={properties}/></DisplayLayout>}
      </MainInfo>
    </>
  )
})

export default NFTPage
