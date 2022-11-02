import React from 'react'
import * as Util from '@stitches/react/types/util'
import { styled } from '../../../styles'

export const buttonStyled = <Type extends keyof JSX.IntrinsicElements | React.ComponentType<any> | Util.Function,
  >(type: Type) =>
    styled(type, {
      height: '48px',
      minWidth: '160px',
      outline: 'none',
      border: 'none',
      borderRadius: '$4',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      fontFamily: '$primary',
      transition: 'transform 0.25s ease 0s, opacity 0.25s ease 0s',
      '&[data-pressed=true]': {
        transform: 'scale(0.97)'
      },
      '&[data-hovered=true]': {
        opacity: 0.7
      },
      '&[data-disabled=true]': {
        cursor: 'not-allowed'
      },
      variants: {
        primary: {
          true: {
            color: '$white',
            background: '$gradients$main',
            '&[data-focus-ring=true]': {
              focusRing: '$blue300'
            },
            '&[data-disabled=true]': {
              background: '$gray100',
              color: '$gray400',
              fill: '$gray400',
              cursor: 'not-allowed'
            }
          }
        },
        secondary: {
          true: {
            color: '$white',
            backgroundColor: '$blue500',
            '&[data-focus-ring=true]': {
              focusRing: '$blue500'
            },
            '&[data-disabled=true]': {
              background: '$gray100',
              color: '$gray400',
              fill: '$gray400',
              cursor: 'not-allowed'
            }
          }
        },
        tertiary: {
          true: {
            color: '$blue500',
            background: 'transparent',
            '&[data-focus-ring=true]': {
              focusRing: '$blue500'
            },
            '&[data-disabled=true]': {
              color: '$gray400',
              cursor: 'not-allowed'
            }
          }
        },
        small: {
          true: {
            height: '36px',
            minWidth: 0,
            padding: '0 18px'
          }
        },
        icon: {
          true: {
            color: '$gray500',
            minWidth: 0,
            padding: 0,
            size: '48px',
            borderRadius: '50%',
            background: 'transparent',
            '& *': {
              height: '26px'
            },
            '&[data-focus-ring=true]': {
              focusRing: '$gray500'
            },
            '&[data-disabled=true]': {
              color: '$gray400',
              cursor: 'not-allowed'
            }
          }
        }
      },
      compoundVariants: [
        {
          icon: true,
          small: true,
          css: {
            height: '36px',
            padding: 0,
            '& *': {
              height: '20px'
            }
          }
        }
      ]
    })
