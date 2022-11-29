import React from 'react'
import { BlockWrapper, Subtitle } from './ToolsBlock'
import { ExplorerSlider } from '../components/ExplorerSlider'
import slideImg from '../img/explorer-slide.jpg'

export default function ExplorerBlock() {
  return (
    <BlockWrapper css={{ maxWidth: '1110px' }}>
      <Subtitle css={{ marginBottom: '$4' }}>Metaverse explorer</Subtitle>
      <ExplorerSlider
        slides={[
          {
            imageUrls: [slideImg, slideImg, slideImg],
            description: `The Sandbox is a decentralized community-driven Metaverse for
          creators to monetize voxel assets and gaming experiences in the
          blockchain!`,
            title: 'Sandbox'
          }
        ]}
      />
    </BlockWrapper>
  )
}
