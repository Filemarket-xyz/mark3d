import React, { ComponentProps, FC, ReactNode } from 'react'

import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'

const HowToGetStartCardStyle = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '16px',
  border: '1px solid $gray300',
  padding: '30px 16px',
  width: '360px',
  height: '80px',
  alignItems: 'center',
  variants: {
    size: {
      small: {
        width: '32.36%',
        '@xl': {
          width: '32.26%'
        },
        '@lg': {
          width: '31.5%'
        },
        '@md': {
          width: '48.17%'
        },
        '@sm': {
          width: '100%'
        }
      },
      medium: {
        width: '49.17%',
        '@lg': {
          width: '48.5%'
        },
        '@md': {
          width: '100%'
        }
      },
      big: {
        width: '65.861%',
        height: '120px',
        padding: '16px',
        '@md': {
          width: '100%'
        }
      }
    },
    miniImg: {
      true: {
        '& img': {
          width: '20px'
        }
      }
    }
  }
})

const RightPartBlockStyle = styled('div', {
  display: 'flex',
  gap: '8px',
  height: '100%',
  alignItems: 'center',
  paddingRight: '5px'
})

const Line = styled('div', {
  height: '100%',
  width: '1px',
  background: '$gray300'
})

type HowToGetStartCardProps = ComponentProps<typeof HowToGetStartCardStyle> & {
  number: number
  content: ReactNode
  img: string
}

const HowToGetStartCard: FC<HowToGetStartCardProps> = ({ number, content, img, size, miniImg }) => {
  return (
    <HowToGetStartCardStyle size={size} miniImg={miniImg}>
      <RightPartBlockStyle>
        <Txt
          h3
          style={{
            fontSize: '18px',
            lineHeight: 'inherit'
          }}
        >
          {number}
        </Txt>
        <Line />
        {content}
      </RightPartBlockStyle>
      <img src={img} />
    </HowToGetStartCardStyle>
  )
}

export default HowToGetStartCard
