import { ComponentProps } from '@stitches/react'
import React, { ReactNode } from 'react'

import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'

const CardStyle = styled('div', {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.85)',
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  justifyContent: 'space-between',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  borderRadius: '24px',
  border: '2px solid $gray300',
  color: '$gray800',
  fontSize: '16px',
  '@lg': {
    gridTemplateColumns: 'auto',
    justifyContent: 'center',
  },
  variants: {
    cardType: {
      main: {
        gap: '42px',
        maxWidth: '707px',
        padding: '20px',
        '@sm': {
          '& img': {
            display: 'none',
          },
        },
      },
      info: {
        gap: '48px',
        padding: '48px',
        borderRadius: '32px',
      },
    },
    linear: {
      true: {
        border: '2px solid rgba(56,188,201, 0.5)',
        boxShadow: '0px 4px 50px rgba(55, 187, 201, 0.25)',
      },
    },
    theme: {
      black: {
        background: '$gray800',
        boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
        color: '$gray200',
        borderColor: '#444649',
      },
    },
  },
})

const Info = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  variants: {
    cardType: {
      main: {
        maxWidth: '433px',
      },
      info: {},
    },
  },
})

const Text = styled('div', {
  ...textVariant('h5').true,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  variants: {
    cardType: {
      main: {
        '& span': {
          lineHeight: '28px !important',
        },
      },
      info: {
        '& span': {
          fontSize: '18px !important',
          fontWeight: '400 !important',
          lineHeight: '30px !important',
          '@sm': {
            fontSize: '12px !important',
          },
        },
      },
    },
  },
})

const Header = styled('h4', {
  ...textVariant('h4').true,
  fontSize: '32px',
  paddingBottom: '12px',
  lineHeight: '40px',
  variants: {
    cardType: {
      main: {
        '@sm': {
          fontSize: '20px',
        },
      },
      info: {
        '@sm': {
          fontSize: '16px',
        },
      },
    },
    linear: {
      true: {
        fontSize: '24px',
        background: 'linear-gradient(90deg, #38BCC9 0%, #088DFA 100%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
      },
    },
  },
})

const RightBottomContent = styled('div', {
  variants: {
    cardType: {
      main: {
        paddingTop: '24px',
      },
      info: {
        paddingTop: '32px',
      },
    },
  },
})

const ImgBlock = styled('a', {
  '@lg': {
    display: 'none',
  },
  variants: {
    cardType: {
      main: {
        width: '192px',
        height: '192px',
      },
      info: {
        width: '366px',
        height: '384px',
        borderRadius: '16px',
      },
    },
  },
})

export type CardProps = ComponentProps<typeof CardStyle> & ComponentProps<typeof RightBottomContent> & {
  headerText?: ReactNode
  img?: string
  text?: ReactNode
  imgHref?: string
  rightBottomContent?: ReactNode
  isImgRight?: boolean
}

const Card: React.FC<CardProps> = ({
  headerText,
  img,
  imgHref,
  text,
  rightBottomContent,
  cardType,
  linear,
  theme,
  isImgRight,
}) => {
  return (
    <CardStyle cardType={cardType} linear={linear} theme={theme}>
      {
        isImgRight ? (
          <>
            <Info cardType={cardType}>
              <Header linear={linear} cardType={cardType}>{headerText}</Header>
              <Text cardType={cardType}>{text}</Text>
              <RightBottomContent cardType={cardType}>{rightBottomContent}</RightBottomContent>
            </Info>
            <ImgBlock href={imgHref} cardType={cardType} style={{ backgroundImage: `url(${img}` }} />
          </>
        )
          : (
            <>
              <ImgBlock href={imgHref} cardType={cardType} style={{ backgroundImage: `url(${img}` }} />
              <Info cardType={cardType}>
                <Header linear={linear} cardType={cardType}>{headerText}</Header>
                <Text cardType={cardType}>{text}</Text>
                <RightBottomContent cardType={cardType}>{rightBottomContent}</RightBottomContent>
              </Info>
            </>
          )
      }
    </CardStyle>
  )
}

export default Card
