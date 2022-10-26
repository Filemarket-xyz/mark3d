import React, { FC, ReactNode, useState } from 'react'
import { styled } from '../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'
import arrow from './img/arrow.svg'
import { Button, Txt } from '../../../UIkit'
import Carousel from '../../Swiper/Swiper'

const ItemWrapper = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    open: {
      true: {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0'
      }
    }
  }
})

const ItemBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '1 1 auto',
  gap: '$3'
})

const ArrowImg = styled('img', {
  variants: {
    up: {
      true: {
        transform: 'rotateX(180deg)'
      }
    }
  }
})

const ItemArrow = styled('button', {
  alignItems: 'center',
  padding: '$4',
  '@md': {
    paddingLeft: 0
  },
  flexShrink: 0,
  cursor: 'pointer',
  background: 'inherit',
  border: 'none',
  borderRadius: 'inherit',
  outline: 'none' // TODO implement outline or smth else for focused elements
})

export const RowProperty = styled('div', {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  variants: {
    title: {
      true: {
        color: '$blue500',
        fontWeight: 600
      }
    },
    hide: {
      sm: {
        '@sm': {
          display: 'none'
        }
      },
      md: {
        '@md': {
          display: 'none'
        }
      },
      lg: {
        '@lg': {
          display: 'none'
        }
      },
      xl: {
        '@xl': {
          display: 'none'
        }
      }
    }
  }
})

const Icon = styled('img', {
  width: '20px',
  height: '20px'
})

const ItemWithContent = styled('div')

const ContentWrapper = styled('div', {
  backgroundColor: '$white',
  borderBottomLeftRadius: '$3',
  borderBottomRightRadius: '$3',
  fontSize: '14px',
  padding: '$4',
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
  width: '50%'
})

export const CheckIcon = () => <Icon src={check} alt='Check icon' />

export const CrossIcon = () => <Icon src={cross} alt='Cross icon' />

interface Props {
  title?: string
  children: ReactNode | JSX.Element | JSX.Element[]
}

export const TableRow: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleRow = () => setIsOpen((isOpen) => !isOpen)

  return (
    <ItemWithContent>
      <ItemWrapper open={isOpen}>
        <ItemBody>{children}</ItemBody>
        <ItemArrow onClick={toggleRow}>
          <ArrowImg up={isOpen} src={arrow} alt='' />
        </ItemArrow>
      </ItemWrapper>
      {isOpen && (
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
                Spatial is dedicated to helping creators and brands build their
                own spaces in the metaverse to share culture together. We
                empower our users to leverage their beautiful spaces to share
                eye popping content, build a tight knit community, and drive
                meaningful sales of their creative works and products. We also
                empower our users to create beautiful and functional 3D spaces
                that they can mint as NFTs and sell/rent to others looking to
                host mind blowing experiences.
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
      )}
    </ItemWithContent>
  )
}
