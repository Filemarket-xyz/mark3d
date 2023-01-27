import React from 'react'
import * as Util from '@stitches/react/types/util'
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
              focusRing: '$blue500'
            },
            '&[data-disabled=true]': {
              background: '$gray400',
              color: '$white',
              fill: '$white',
              cursor: 'not-allowed'
            }
          }
        },
        secondary: {
          true: {
            color: '$blue500',
            backgroundColor: '$gray100',
            '&[data-focus-ring=true]': {
              focusRing: '$blue500'
            },
            '&[data-disabled=true]': {
              background: '$gray200',
              color: '$gray600',
              fill: '$gray600',
              cursor: 'not-allowed',
              border: '2px solid $gray300'
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
              color: '$gray600',
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
        fullWidth: {
          true: {
            width: '100%'
          }
        },
        icon: {
          true: {
            color: '$white',
            minWidth: 0,
            padding: 0,
            size: '48px',
            borderRadius: '50%',
            background: 'transparent',
            '& > *': {
              height: '26px'
            },
            '&[data-focus-ring=true]': {
              focusRing: '$white'
            },
            '&[data-disabled=true]': {
              color: '$gray600',
              fill: '$gray600',
              cursor: 'not-allowed'
            }
          }
        },
        iconCover: {
          true: {
            '& > *': {
              borderRadius: '50%',
              size: 'calc(100% - 4px)',
              objectFit: 'cover'
            }
          }
        }
      },
      compoundVariants: [
        {
          icon: true,
          small: true,
          css: {
            size: '36px',
            padding: 0,
            '& > *': {
              height: '20px'
            }
          }
        },
        {
          icon: true,
          iconCover: true,
          css: {
            '& > *': {
              size: 'calc(100% - 4px)'
            }
          }
        },
        {
          icon: true,
          primary: true,
          css: {
            color: '$white',
            background: '$gradients$main'
          }
        },
        {
          icon: true,
          secondary: true,
          css: {
            true: {
              color: '$blue500',
              backgroundColor: '$gray100',
              '&[data-disabled=true]': {
                background: '$gray200',
                color: '$gray600',
                fill: '$gray600'
              }
            }
          }
        }
      ]
    })
