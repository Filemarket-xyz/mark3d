import React, { FC } from 'react'
import { styled } from '../../../../styles'

const ItemWrapper = styled('div', {
  backgroundColor: '#fff',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
  display: 'flex',
  justifyContent: 'space-between'
})

const ItemBody = styled('div', {
  padding: '$3 $4',
  alignItems: 'center'
})

const ItemArrow = styled('div', {
  alignItems: 'center',
  padding: '$4'
})

interface Props {
  title?: string
  children: JSX.Element
}

export const TableItem: FC<Props> = ({ children }) => {
  return (
    <ItemWrapper>
      <ItemBody>hello world</ItemBody>
      <ItemArrow>s</ItemArrow>
    </ItemWrapper>
  )
}
