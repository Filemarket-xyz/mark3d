import * as Util from '@stitches/react/types/util'
import React from 'react'

import RedirectImg from '../../../assets/img/Redirect.svg'
import { styled } from '../../../styles'
import { textVariant } from '../Txt'

export const linkStyled = <Type extends keyof JSX.IntrinsicElements | React.ComponentType<any> | Util.Function,
>(type: Type) =>
  styled(type, {
    fontFamily: '$button',
    fontSize: '$button1',
    fontWeight: '$button',
    lineHeight: '$button',
    color: '$blue500',
    fill: '$blue500',
    transition: 'opacity 0.25s ease 0s',
    outline: 'none',
    textDecoration: 'none',
    cursor: 'pointer',

    '&[data-hovered=true]': {
      opacity: 0.7,
    },
    '&[data-focus=true]': {
      focusRing: '$blue500',
    },
    '&[data-pressed=true]': {
      opacity: 0.9,
    },
    '&[data-disabled=true]': {
      color: '$gray400',
      fill: '$gray400',
      cursor: 'not-allowed',
    },
    variants: {
      gray: {
        true: {
          color: '$gray500',
          fill: '$gray500',
        },
      },
      red: {
        true: {
          color: '$red',
          fill: '$red',
        },
      },
      footer: {
        true: {
          color: '$gray300',
          fill: '$gray300',
          ...textVariant('primary2').true,
          fontSize: '14px',
          fontWeight: '400',
        },
      },
      small: {
        ...textVariant('primary3'),
      },
      underlined: {
        true: {
          textDecoration: 'underline',
        },
      },
      iconRedirect: {
        true: {
          position: 'relative',
          '&:after': {
            content: `url(${RedirectImg})`,
            verticalAlign: 'middle',
            paddingLeft: '5px',
          },
        },
      },
      howToGetStart: {
        true: {
          fontSize: '14px',
          lineHeight: '16px',
          fontWeight: '600',
          '@md': {
            fontSize: '12px',
            lineHeight: '14px',
          },
        },
      },
      mdFullWidth: {
        true: {
          '@md': {
            width: '100%',
          },
        },
      },
      lgFullWidth: {
        true: {
          '@lg': {
            width: '100%',
          },
        },
      },
      fileBunniesTitle: {
        true: {
          color: 'white',
          ...textVariant('h1').true,
          fontSize: '48px',
          '&:hover': {
            filter: 'brightness(0.9)',
          },
          '@lg': {
            fontSize: '40px',
          },
          '@sm': {
            fontSize: '24px',
          },
        },
      },
    },
  })
