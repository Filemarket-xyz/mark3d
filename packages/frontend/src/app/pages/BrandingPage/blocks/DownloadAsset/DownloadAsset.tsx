import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'
import DownloadButton from '../../blocks/DownloadButton/DownloadButton'

const AssetInner = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  border: '4px solid #EAEAEC',
  borderRadius: '$4',
  '@md': {
    flexDirection: 'column-reverse',
  },
})

const AssetLinksWrapper = styled('div', {
  display: 'inline-flex',
  flexDirection: 'column',
  rowGap: '24px',
  padding: '44px 48px',
  '@md': {
    alignItems: 'center',
    padding: '30px 36px',
  },
  '@sm': {
    padding: '16px 24px',
  },
})

const AssetName = styled(Txt, {
  fontFamily: '$body',
  fontSize: '$h3',
  fontWeight: '$primary',
  lineHeight: '1',
  color: '$gray700',
  '@md': {
    fontSize: '$h4',
  },
  '@sm': {
    fontSize: '$h5',
  },
})

const AssetPreviewWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  top: '-4px',
  right: '-4px',
  marginBottom: '-8px',
  height: 'calc(100% + 8px)',
  width: 'auto',
  borderRadius: '$4',
  transition: 'all 0.3s ease-in-out',
  variants: {
    previewStyle: {
      light: {
        border: '4px solid #A9ADB1',
        backgroundColor: '$white',
      },
      dark: {
        border: '4px solid #A9ADB1',
        backgroundColor: '$gray700',
      },
    },
  },
  '@md': {
    width: 'calc(100% + 8px)',
    left: '-4px',
    height: '120px',
    img: {
      height: '100%',
    },
  },
})

const AssetLinks = styled('div', {
  display: 'flex',
  columnGap: '18px',
  '@sm': {
    columnGap: '12px',
    a: {
      minWidth: '147px',
    },
  },
})

interface DownloadAssetProps {
  pngAsset: string
  svgAsset: string
  title: string
  previewStyle: 'light' | 'dark'
}

export default function DownloadAsset (props: DownloadAssetProps) {
  return (
    <AssetInner>
      <AssetLinksWrapper>
        <AssetName>{props.title}</AssetName>
        <AssetLinks>
          <DownloadButton downloadHref={props.pngAsset}>png</DownloadButton>
          <DownloadButton downloadHref={props.svgAsset}>svg</DownloadButton>
        </AssetLinks>
      </AssetLinksWrapper>
      <AssetPreviewWrapper previewStyle={props.previewStyle}>
        <img src={props.svgAsset} />
      </AssetPreviewWrapper>
    </AssetInner>
  )
}
