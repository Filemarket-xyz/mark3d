import React from 'react'
import { styled } from '../../../../styles'
import { Button, Txt } from '../../../UIkit'
import Carousel from '../../Swiper/Swiper'

const ContentWrapper = styled('div', {
  backgroundColor: '$white',
  borderBottomLeftRadius: '$3',
  borderBottomRightRadius: '$3',
  fontSize: '14px',
  padding: '$4',
  '@sm': {
    paddingLR: '$3'
  },
  paddingTop: 0
})

const Hr = styled('hr', {
  width: '100%',
  height: '2px',
  background:
    'linear-gradient(270deg, rgba(0, 220, 255, 0.25) 0%, rgba(225, 75, 236, 0.25) 85.65%);',
  border: 'none',
  display: 'block'
})

const Content = styled('section', {
  paddingTop: '$4',
  display: 'flex',
  '@md': {
    flexDirection: 'column-reverse'
  },
  justifyContent: 'space-between',
  gap: '$4'
})

const Description = styled('p', {
  color: '$gray500',
  fontSize: '$primary2',
  marginTop: '$3',
  marginBottom: '$4'
})

const MainInfo = styled('div', {
  flexGrow: '1'
})

const Preview = styled('div', {
  width: '50%',
  '@md': {
    width: '100%'
  }
})

export default function RowContent() {
  return (
    <ContentWrapper>
      <Hr />
      <Content>
        <MainInfo>
          <Txt h3 css={{ fontSize: '$body1', display: 'block' }}>
            Spatial
          </Txt>
          <Txt
            h4
            css={{ fontSize: '$body4', display: 'block', marginTop: '$4' }}
          >
            Description
          </Txt>
          <Description>
            Spatial is dedicated to helping creators and brands build their own
            spaces in the metaverse to share culture together. We empower our
            users to leverage their beautiful spaces to share eye popping
            content, build a tight knit community, and drive meaningful sales of
            their creative works and products. We also empower our users to
            create beautiful and functional 3D spaces that they can mint as NFTs
            and sell/rent to others looking to host mind blowing experiences.
          </Description>
          <Button css={{ background: '$gradients$main', color: '$white' }}>
            Explore
          </Button>
        </MainInfo>
        <Preview>
          <Txt h3 css={{ fontSize: '$body2' }}>
            Visual preview
          </Txt>
          <Carousel />
        </Preview>
      </Content>
    </ContentWrapper>
  )
}
