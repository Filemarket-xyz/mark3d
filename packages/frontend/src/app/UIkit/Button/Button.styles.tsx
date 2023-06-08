import * as Util from '@stitches/react/types/util'
import React from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../Txt'

export const buttonStyled = <Type extends keyof JSX.IntrinsicElements | React.ComponentType<any> | Util.Function,
>(type: Type) =>
  styled(type, {
    height: '48px',
    minWidth: '160px',
    outline: 'none',
    border: 'none',
    borderRadius: '$1',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s ease 0s, opacity 0.25s ease 0s',
    ...textVariant('button1').true,
    textDecoration: 'none',
    '&[data-pressed=true]': {
      transform: 'scale(0.97)',
    },
    '&[data-hovered=true]': {
      opacity: 0.7,
    },
    '&[data-disabled=true]': {
      cursor: 'not-allowed',
    },
    variants: {
      primary: {
        true: {
          color: '$white',
          fill: '$white',
          background: '$gradients$main',
          '&[data-focus-ring=true]': {
            focusRing: '$blue500',
          },
          '&[data-disabled=true]': {
            background: '$gray400',
            color: '$white',
            fill: '$white',
            cursor: 'not-allowed',
          },
        },
      },
      secondary: {
        true: {
          color: '$blue500',
          fill: '$blue500',
          backgroundColor: '$gray100',
          '&[data-focus-ring=true]': {
            focusRing: '$blue500',
          },
          '&[data-disabled=true]': {
            background: '$gray200',
            color: '$gray600',
            fill: '$gray600',
            cursor: 'not-allowed',
            border: '2px solid $gray300',
          },
        },
      },
      tertiary: {
        true: {
          color: '$blue500',
          fill: '$blue500',
          background: 'transparent',
          '&[data-focus-ring=true]': {
            focusRing: '$blue500',
          },
          '&[data-disabled=true]': {
            color: '$gray600',
            fill: '$gray600',
            cursor: 'not-allowed',
          },
        },
      },
      glowing: {
        true: {
          transition: 'all 0.25s ease',
          color: '$blue500',
          minWidth: 240,
          border: '2px solid $blue500',
          background: '$white',
          '&[data-hovered=true]': {
            opacity: 1,
            color: '$blue300',
            borderColor: '$blue300',
          },
        },
      },
      input: {
        true: {
          color: 'white',
          background: '$blue300',
          '&[data-focus-ring=true]': {
            focusRing: '$blue500',
          },
          '&[data-disabled=true]': {
            color: 'white',
            background: '$gray600',
            cursor: 'not-allowed',
          },
        },
      },
      small: {
        true: {
          height: '32px',
          minWidth: 0,
          padding: '0 18px',
        },
      },
      fullWidth: {
        true: {
          width: '100%',
        },
      },
      icon: {
        true: {
          color: '$white',
          fill: '$white',
          minWidth: 0,
          padding: 0,
          size: '48px',
          borderRadius: '50%',
          background: 'transparent',
          '& > *': {
            height: '26px',
          },
          '&[data-focus-ring=true]': {
            focusRing: '$blue500',
          },
          '&[data-disabled=true]': {
            color: '$gray600',
            fill: '$gray600',
            cursor: 'not-allowed',
          },
        },
      },
      borderRadiusSecond: {
        true: {
          borderRadius: '$2',
        },
      },
      iconCover: {
        true: {
          '& > *': {
            borderRadius: '50%',
            size: 'calc(100% - 4px)',
            objectFit: 'cover',
          },
        },
      },
      fakeNft: {
        true: {
          width: '252px',
          height: '56px',
          borderRadius: '32px',
        },
      },
      disconnect: {
        true: {
          border: '2px solid #C54B5C',
          color: '#C54B5C',
          background: 'white',
        },
      },
      fakeNftRarity: {
        common: {
          background: 'linear-gradient(90deg, #ACCBEE 0%, #77AFFF 100%)',
        },
        uncommon: {
          background: 'linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)',
        },
        rare: {
          background: 'linear-gradient(90deg, #37ECBA 0%, #72AFD3 100%)',
        },
        legendary: {
          background: 'linear-gradient(90deg, #B224EF 0%, #7579FF 100%)',
        },
        mythical: {
          background: 'linear-gradient(90deg, #FC6076 0%, #FF9A44 100%)',
        },
      },
      mediumMxWidth: {
        true: {
          '@md': {
            width: '100% !important',
          },
        },
      },
      smallMxWidth: {
        true: {
          '@sm': {
            width: '100% !important',
          },
        },
      },
      mediumHg: {
        true: {
          height: '56px',
        },
      },
      largeHg: {
        true: {
          height: '80px',
        },
      },
      whiteWithBlue: {
        true: {
          background: 'white',
          ...textVariant('primary1').true,
          fontSize: '18px',
          border: '2px solid #028FFF',
          borderRadius: '12px',
          color: '#028FFF',
          '&[data-hovered=true]': {
            opacity: 1,
            filter: 'brightness(1.1)',
          },
          '&[data-disabled=true]': {
            color: '$gray400',
            border: '2px solid $gray400 !important',
            cursor: 'not-allowed',
            '& img': {
              filter: 'contrast(0)',
            },
          },
        },
      },
      isDisabled: {
        true: {
          color: '$gray400',
          border: '2px solid $gray400 !important',
          cursor: 'not-allowed',
          '& img': {
            filter: 'contrast(0), brightness(1.2)',
          },
        },
      },
      modalButton: {
        true: {
          width: '240px',
          height: '48px',
        },
      },
      modalButtonFontSize: {
        true: {
          fontSize: '16px',
        },
      },
    },
    compoundVariants: [
      {
        icon: true,
        small: true,
        css: {
          size: '36px',
          padding: 0,
          '& > *': {
            height: '20px',
          },
        },
      },
      {
        icon: true,
        iconCover: true,
        css: {
          '& > *': {
            size: 'calc(100% - 4px)',
          },
        },
      },
      {
        icon: true,
        primary: true,
        css: {
          color: '$white',
          fill: '$white',
          background: '$gradients$main',
        },
      },
      {
        icon: true,
        secondary: true,
        css: {
          color: '$blue500',
          fill: '$blue500',
          backgroundColor: '$gray100',
          '&[data-disabled=true]': {
            background: '$gray200',
            color: '$gray600',
            fill: '$gray600',
          },
        },
      },
      {
        icon: true,
        tertiary: true,
        css: {
          color: '$blue500',
          fill: '$blue500',
          background: 'transparent',
          '&[data-disabled=true]': {
            color: '$gray600',
            fill: '$gray600',
          },
        },
      },
    ],
  })
