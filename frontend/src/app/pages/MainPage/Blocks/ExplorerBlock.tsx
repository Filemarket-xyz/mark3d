import React from 'react'
import { styled } from '../../../../styles'
import arrowLeft from '../img/arrow-left.svg'
import sandboxTitle from '../img/sandbox-title.svg'
import { BlockWrapper, Subtitle } from './ToolsBlock'
import { Button } from '../../../UIkit'
import slideImg from '../img/explorer-slide.jpg'

const ExplorerInfo = styled('div', {})
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

const SliderContainer = styled('div', {
  width: '100%',
  height: 400,
  display: 'flex',
  gap: '$2',
  '@sm': {
    gap: '$1',
    height: 200
  }
})

const SlideContainer = styled('div', {
  perspective: 2000,
  width: '30%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const Slide = styled('img', {
  display: 'flex',
  width: '100%',
  border: '2px solid transparent',
  background:
    'linear-gradient(#fff 0 0) padding-box, $gradients$main border-box',
  objectFit: 'cover',
  boxShadow: '0px 10px 30px rgba(89, 89, 108, 0.4)',
  borderRadius: '$1'
})

const LeftSlide = styled(Slide, {
  transform: 'rotate3d(0, 1, 0, 40deg) scale(1.3)'
})

const CenterSlide = styled(Slide, {
  transform: 'scale(0.93)'
})

const RightSlide = styled(Slide, {
  transform: 'rotate3d(0, 1, 0, -40deg) scale(1.3)'
})

export default function ExplorerBlock() {
  return (
    <BlockWrapper css={{ maxWidth: '1110px' }}>
      <Subtitle css={{ marginBottom: '$4' }}>Metaverse explorer</Subtitle>
      <SliderContainer>
        <SlideContainer>
          <LeftSlide src={slideImg} />
        </SlideContainer>

        <SlideContainer css={{ flexGrow: 1 }}>
          <CenterSlide src={slideImg} />
        </SlideContainer>

        <SlideContainer>
          <RightSlide src={slideImg} />
        </SlideContainer>
      </SliderContainer>

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
