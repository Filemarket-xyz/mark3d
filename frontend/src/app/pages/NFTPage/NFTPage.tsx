import React from 'react'
import { styled } from '../../../styles'
import { PageLayout, textVariant } from '../../UIkit'

const NFTPreviewContainer = styled('div', {
  paddingTop: '$layout$navbarheight',
  width: '100%',
  // TODO height will be set by 3d previewer
  height: 800,
  background: '$gray300'
})

const NftName = styled('h1', {
  ...textVariant('h3').true,
  color: '$blue900',
  marginBottom: '$1'
})

const MintTime = styled('p', {
  ...textVariant('primary1').true,
  color: '$gray500'
})

export default function NFTPage() {
  return (
    <>
      <NFTPreviewContainer></NFTPreviewContainer>
      <PageLayout>
        <NftName>VR Glasses</NftName>
        <MintTime>Minted on Sep 9, 2022</MintTime>
      </PageLayout>
    </>
  )
}
