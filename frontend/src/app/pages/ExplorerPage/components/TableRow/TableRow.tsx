import React, { FC, ReactNode, useState } from 'react'
import { styled } from '../../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'
import arrow from './img/arrow.svg'
import RowContent from './RowContent'
import { textVariant } from '../../../../UIkit'

/** Defines content when row is expanded */
export interface IRowContent {
  description: string
  imageURLS: string[]
  link: string
}

export const ItemWrapper = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  minHeight: '80px',
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

export const ItemBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '1 1 auto',
  gap: '$3',
  '@sm': {
    paddingLR: '$3'
  }
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

export const RowCell = styled('div', {
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  width: 0,
  alignItems: 'center',
  variants: {
    title: {
      true: {
        ...textVariant('primary2').true,
        color: '$blue500'
      },
      false: {
        ...textVariant('secondary1').true,
        fontSize: '14px'
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

export const CheckIcon = () => <Icon src={check} alt='Check icon' />

export const CrossIcon = () => <Icon src={cross} alt='Cross icon' />

interface Props {
  children: ReactNode
  content: IRowContent
  contentTitle: string
}

export const TableRow: FC<Props> = ({ children, content, contentTitle }) => {
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
        <RowContent
          title={contentTitle}
          description={content.description}
          imageURLS={content.imageURLS}
          link={content.link}
        />
      )}
    </ItemWithContent>
  )
}