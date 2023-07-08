import { useState } from 'react'

import { styled } from '../../../../../styles'
import DownloadAsset from '../../blocks/DownloadAsset/DownloadAsset'
import DownloadButton from '../../blocks/DownloadButton/DownloadButton'
import Switch from '../../blocks/Switch/Switch'
import { PNG_ASSETS, SVG_ASSETS } from './assets'

type AssetType = 'blue' | 'green' | 'dark' | 'light'
type PreviewStyle = 'light' | 'dark'

const SwitchWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$4',
  '.downloadAllButton': {
    '@md': {
      display: 'none',
    },
  },
})

const AssetsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '32px',
  '@md': {
    rowGap: '28px',
  },
  '@sm': {
    rowGap: '24px',
  },
  '.downloadAllMobileButton': {
    display: 'none',
    '@md': {
      display: 'flex',
    },
  },
})

export default function Assets () {
  const [currentAssets, setCurrentAssets] = useState<AssetType>('blue')
  const [previewStyle, setPreviewStyle] = useState<PreviewStyle>('light')

  const options = [
    { label: 'Blue', value: 'blue', previewStyle: 'light' },
    { label: 'Green', value: 'green', previewStyle: 'dark' },
    { label: 'Dark', value: 'dark', previewStyle: 'light' },
    { label: 'Light', value: 'light', previewStyle: 'dark' },
  ]

  const handleAssetsChange = (asset: string) => {
    setCurrentAssets(asset as AssetType)
    setPreviewStyle(
      options.find((option) => option.value === asset)?.previewStyle as PreviewStyle,
    )
  }

  return (
    <>
      <SwitchWrapper>
        <Switch options={options} onChange={handleAssetsChange} />
        <DownloadButton class={'downloadAllButton'} downloadHref="#" bigBtn>full zip</DownloadButton>
      </SwitchWrapper>
      <AssetsWrapper>
        <DownloadAsset
          pngAsset={PNG_ASSETS.logotype_line[currentAssets]}
          svgAsset={SVG_ASSETS.logotype_line[currentAssets]}
          title='Logotype (line)'
          previewStyle={previewStyle}
        />
        <DownloadAsset
          pngAsset={PNG_ASSETS.logotype[currentAssets]}
          svgAsset={SVG_ASSETS.logotype[currentAssets]}
          title='Logotype'
          previewStyle={previewStyle}
        />
        <DownloadAsset
          pngAsset={PNG_ASSETS.logomark[currentAssets]}
          svgAsset={SVG_ASSETS.logomark[currentAssets]}
          title='Logomark'
          previewStyle={previewStyle}
        />
        <DownloadAsset
          pngAsset={PNG_ASSETS.wordmark[currentAssets]}
          svgAsset={SVG_ASSETS.wordmark[currentAssets]}
          title="Wordmark"
          previewStyle={previewStyle}
        />
        <DownloadButton downloadHref="#" class={'downloadAllMobileButton'}>full zip</DownloadButton>
      </AssetsWrapper>
    </>
  )
}
