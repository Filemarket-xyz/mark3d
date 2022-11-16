import React from 'react'
import { styled } from '../../../../styles'
import sandbox from '../img/sandbox.png'
import arrowLeft from '../img/arrow-left.svg'

import sandboxTitle from '../img/sandbox-title.svg'

import { BlockWrapper, Subtitle } from './ToolsBlock'
import { Button } from '../../../UIkit'

const ExplorerImg = styled('img', {
  width: '100%',
  objectFit: 'contain'
})
const ExplorerInfo = styled('div', {
  marginTop: '-64px',
  '@md': {
    marginTop: '-48px'
  },
  '@sm': {
    marginTop: '-32px'
  }
})
const ExplorerTitle = styled('div', {
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundImage: `url(${sandboxTitle})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  maxWidth: '130px',
  height: '64px',
  '@md': {
    maxWidth: '115px'
  },
  '@sm': {
    maxWidth: '100px'
  }
})

const ExploreControls = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '$4',
  marginBottom: '$4'
})

const ExplorerDescription = styled('p', {
  fontSize: '$body1',
  maxWidth: '730px',
  textAlign: 'center',
  '@md': {
    fontSize: '$body2'
  }
})

const ArrowButton = styled('div', {
  width: '64px',
  height: '64px',
  backgroundImage: `url(${arrowLeft})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  borderRadius: '50%',
  backgroundColor: '$whiteOp50',
  border: 'none',
  variants: {
    rightArrow: {
      true: {
        transform: 'rotate(180deg)'
      }
    }
  },
  flexShrink: 0,
  '@sm': {
    width: '48px',
    height: '48px'
  }
})

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: '$5'
})

export default function ExplorerBlock() {
  return (
    <BlockWrapper css={{ maxWidth: '1110px' }}>
      <Subtitle css={{ marginBottom: '$4' }}>Metaverse explorer</Subtitle>
      <ExplorerImg src={sandbox} />
      <ExplorerInfo>
        <ExplorerTitle />
        <ExploreControls>
          <ArrowButton />
          <ExplorerDescription>
            The Sandbox is a decentralized community-driven Metaverse for
            creators to monetize voxel assets and gaming experiences in the
            blockchain!
          </ExplorerDescription>
          <ArrowButton rightArrow />
        </ExploreControls>
        <ButtonContainer>
          <Button primary css={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Explore more
          </Button>
        </ButtonContainer>
      </ExplorerInfo>
    </BlockWrapper>
  )
}
