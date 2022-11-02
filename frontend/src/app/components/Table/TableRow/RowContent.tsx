import { ReactNode } from 'react'
import { styled } from '../../../../styles'
import { Button, textVariant, Txt } from '../../../UIkit'
import Carousel from '../../Swiper/Swiper'
import { IRowContent } from '../utils/tableBuilder'

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
  marginTop: '$3',
  marginBottom: '$4',
  ...textVariant('secondary1').true,
  fontSize: '14px',
  lineHeight: '129%'
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

interface Props extends IRowContent {
  title: ReactNode
}

export default function RowContent({ description, imageURLS, title }: Props) {
  return (
    <ContentWrapper>
      <Hr />
      <Content>
        <MainInfo>
          <Txt h3 css={{ fontSize: '$body1', display: 'block' }}>
            {title}
          </Txt>
          <Txt primary1 css={{ display: 'block', marginTop: '$4' }}>
            Description
          </Txt>
          <Description>{description}</Description>
          <Button primary>
            <Txt button1>Explore</Txt>
          </Button>
        </MainInfo>
        <Preview>
          <Txt primary1>Visual preview</Txt>
          <Carousel imageURLS={imageURLS} />
        </Preview>
      </Content>
    </ContentWrapper>
  )
}
