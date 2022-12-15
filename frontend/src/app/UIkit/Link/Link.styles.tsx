import React from 'react'
import * as Util from '@stitches/react/types/util'
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
        opacity: 0.7
      },
      '&[data-focus=true]': {
        focusRing: '$blue500'
      },
      '&[data-pressed=true]': {
        opacity: 0.9
      },
      '&[data-disabled=true]': {
        color: '$gray400',
        fill: '$gray400',
        cursor: 'not-allowed'
      },
      variants: {
        gray: {
          true: {
            color: '$gray500',
            fill: '$gray500'
          }
        },
        white: {
          true: {
            color: '$white',
            fill: '$white',
            opacity: 0.75,
            '&[data-hovered=true]': {
              opacity: 1
            }
          }
        },
        small: {
          ...textVariant('primary3')
        },
        underlined: {
          true: {
            textDecoration: 'underline'
          }
        }
      }
    })
