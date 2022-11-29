import React, { useState } from 'react'
import { styled } from '../../../../styles'
import arrowLeft from '../img/arrow-left.svg'
import { Button, textVariant } from '../../../UIkit'

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

const ImageContainer = styled('div', {
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

const LeftImage = styled(Slide, {
  transform: 'rotate3d(0, 1, 0, 40deg) scale(1.3)'
})

const CenterImage = styled(Slide, {
  transform: 'scale(0.93)'
})

const RightImage = styled(Slide, {
  transform: 'rotate3d(0, 1, 0, -40deg) scale(1.3)'
})

const ExplorerInfo = styled('div', {})
const ExplorerTitle = styled('div', {
  ...textVariant('h3').true,
  marginBottom: '$3',
  textAlign: 'center',
  color: '$blue900'
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

interface SlideProps {
  imageUrls: [string, string, string]
  title: string
  description: string
}

interface ExplorerSliderProps {
  slides: SlideProps[]
}

export const ExplorerSlider = ({ slides }: ExplorerSliderProps) => {
  const [slideIndex, setSlideIndex] = useState(0)

  const changeSlide = (to: 'left' | 'right') => {
    if (to === 'left') {
      setSlideIndex(slides.length === 0 ? slides.length - 1 : slideIndex - 1)
    } else {
      setSlideIndex((slides.length + slideIndex) % slides.length)
    }
  }

  return (
    <>
      <SliderContainer>
        <ImageContainer>
          <LeftImage src={slides[slideIndex].imageUrls[0]} />
        </ImageContainer>

        <ImageContainer css={{ flexGrow: 1 }}>
          <CenterImage src={slides[slideIndex].imageUrls[1]} />
        </ImageContainer>

        <ImageContainer>
          <RightImage src={slides[slideIndex].imageUrls[2]} />
        </ImageContainer>
      </SliderContainer>

      <ExplorerInfo>
        <ExplorerTitle>{slides[slideIndex].title}</ExplorerTitle>
        <ExploreControls>
          <ArrowButton onClick={() => changeSlide('left')} />
          <ExplorerDescription>
            {slides[slideIndex].description}
          </ExplorerDescription>
          <ArrowButton rightArrow onClick={() => changeSlide('right')} />
        </ExploreControls>
        <ButtonContainer>
          <Button primary css={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Explore more
          </Button>
        </ButtonContainer>
      </ExplorerInfo>
    </>
  )
}
