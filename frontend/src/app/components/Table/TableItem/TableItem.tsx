import { FC, ReactNode } from 'react'
import { styled } from '../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'
import arrow from './img/arrow.svg'

const ItemWrapper = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between'
})

const ItemBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '1 1 auto'
})

const ItemArrow = styled('div', {
  alignItems: 'center',
  padding: '$4'
})

export const ItemProperty = styled('div', {
  variants: {
    title: {
      true: {
        color: '$blue500',
        fontWeight: 600
      }
    }
  }
})

const Icon = styled('img', {
  width: '20px',
  height: '20px'
})

export const CheckIcon = () => <Icon src={check} alt='Check icon' />

export const CrossIcon = () => <Icon src={cross} alt='Cross icon' />

interface Props {
  title?: string
  children: ReactNode | JSX.Element | JSX.Element[]
}

export const TableItem: FC<Props> = ({ children }) => {
  return (
    <ItemWrapper>
      <ItemBody>{children}</ItemBody>
      <ItemArrow
        css={{
          '@md': {
            display: 'none'
          }
        }}
      >
        <img src={arrow} alt='' />
      </ItemArrow>
    </ItemWrapper>
  )
}
