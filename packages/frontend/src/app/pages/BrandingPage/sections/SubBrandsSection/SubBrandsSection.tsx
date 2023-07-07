import { useState } from 'react'

import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'
import DownloadButton from '../../blocks/DownloadButton/DownloadButton'
import { PNG_SUB_BRANDS, SVG_SUB_BRANDS } from './assets'

type AssetType = 'color' | 'dark' | 'light'

const SwitchWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$4',
  '.switch': {
    display: 'inline-flex',
    columnGap: '$1',
    padding: '$2',
    borderRadius: '$4',
    border: '2px solid #0090FF',
  },
  '.switchButton': {
    padding: '12px 36px',
    borderRadius: '$4',
    backgroundColor: 'transparent',
    fontFamily: '$body',
    fontSize: '$body2',
    fontWeight: '$primary',
    lineHeight: 'ternary3',
    color: '#0090FF',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: '2px solid transparent',
    '&.active': {
      backgroundColor: '#0090FF',
      color: '$white',
    },
    '&:hover': {
      borderColor: '#0090FF',
    },
  },
})

const AssetsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '32px',
})

const AssetItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  border: '4px solid #EAEAEC',
  borderRadius: '$4',
})

const AssetLinksWrapper = styled('div', {
  display: 'inline-flex',
  flexDirection: 'column',
  rowGap: '24px',
  padding: '44px 48px',
})

const AssetName = styled(Txt, {
  fontFamily: '$body',
  fontSize: '$h3',
  fontWeight: '$primary',
  lineHeight: '1',
  color: '$gray700',
})

const AssetPreview = styled('img', {
  position: 'relative',
  top: '-4px',
  right: '-4px',
  marginBottom: '-8px',
  height: 'calc(100% + 8px)',
  width: 'auto',
})

export default function SubBrandsSection () {
  const [currentAssets, setCurrentAssets] = useState<AssetType>('color')

  const handleAssetsSwitch = (e: any) => {
    const button = e.target as HTMLElement
    if (button.dataset.assets && currentAssets !== button.dataset.assets) {
      setCurrentAssets(button.dataset.assets as AssetType)
    }
  }

  return (
    <>
      <SwitchWrapper>
        <div className='switch' onClick={handleAssetsSwitch}>
          <button className={`switchButton ${currentAssets === 'color' && 'active'}`} data-assets="color">Colored</button>
          <button className={`switchButton ${currentAssets === 'dark' && 'active'}`} data-assets="dark">Dark</button>
          <button className={`switchButton ${currentAssets === 'light' && 'active'}`} data-assets="light">Light</button>
        </div>
        <DownloadButton downloadHref="#">full zip</DownloadButton>
      </SwitchWrapper>
      <AssetsWrapper>
        <AssetItem>
          <AssetLinksWrapper>
            <AssetName>Logotype (line)</AssetName>
            <div style={{ display: 'flex', columnGap: '18px' }}>
              <DownloadButton downloadHref={PNG_SUB_BRANDS.logo[`${currentAssets}`]}>png</DownloadButton>
              <DownloadButton downloadHref={SVG_SUB_BRANDS.logo[currentAssets]}>svg</DownloadButton>
            </div>
          </AssetLinksWrapper>
          <AssetPreview src={PNG_SUB_BRANDS.logo[currentAssets]} />
        </AssetItem>
        <AssetItem>
          <AssetLinksWrapper>
            <AssetName>Logotype (line)</AssetName>
            <div style={{ display: 'flex', columnGap: '18px' }}>
              <DownloadButton downloadHref={PNG_SUB_BRANDS.logomarkFB[`${currentAssets}`]}>png</DownloadButton>
              <DownloadButton downloadHref={SVG_SUB_BRANDS.logomarkFB[currentAssets]}>svg</DownloadButton>
            </div>
          </AssetLinksWrapper>
          <AssetPreview src={PNG_SUB_BRANDS.logomarkFB[currentAssets]} />
        </AssetItem>
        <AssetItem>
          <AssetLinksWrapper>
            <AssetName>Logotype (line)</AssetName>
            <div style={{ display: 'flex', columnGap: '18px' }}>
              <DownloadButton downloadHref={PNG_SUB_BRANDS.logotype[`${currentAssets}`]}>png</DownloadButton>
              <DownloadButton downloadHref={SVG_SUB_BRANDS.logotype[currentAssets]}>svg</DownloadButton>
            </div>
          </AssetLinksWrapper>
          <AssetPreview src={PNG_SUB_BRANDS.logotype[currentAssets]} />
        </AssetItem>
        <AssetItem>
          <AssetLinksWrapper>
            <AssetName>Logotype (line)</AssetName>
            <div style={{ display: 'flex', columnGap: '18px' }}>
              <DownloadButton downloadHref={PNG_SUB_BRANDS.logomarkFW[`${currentAssets}`]}>png</DownloadButton>
              <DownloadButton downloadHref={SVG_SUB_BRANDS.logomarkFW[currentAssets]}>svg</DownloadButton>
            </div>
          </AssetLinksWrapper>
          <AssetPreview src={PNG_SUB_BRANDS.logomarkFW[currentAssets]} />
        </AssetItem>
        <AssetItem>
          <AssetLinksWrapper>
            <AssetName>Logotype (line)</AssetName>
            <div style={{ display: 'flex', columnGap: '18px' }}>
              <DownloadButton downloadHref={PNG_SUB_BRANDS.logotypeFW[`${currentAssets}`]}>png</DownloadButton>
              <DownloadButton downloadHref={SVG_SUB_BRANDS.logotypeFW[currentAssets]}>svg</DownloadButton>
            </div>
          </AssetLinksWrapper>
          <AssetPreview src={PNG_SUB_BRANDS.logotypeFW[currentAssets]} />
        </AssetItem>
      </AssetsWrapper>
    </>
  )
}
