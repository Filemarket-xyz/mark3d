import React, { PropsWithChildren } from 'react'
import { styled } from '../../../styles'

const TableWrapper = styled('div', {
  paddingTop: '$4'
})

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3'
})

export const HeadItem = styled('p', {
  position: 'absolute',
  bottom: 'calc($4 + $4 + $3)',
  color: '#8F8F8F',
  fontWeight: '600'
})

export default function Table(props: PropsWithChildren) {
  return (
    <TableWrapper>
      <TableBody>{props.children}</TableBody>
    </TableWrapper>
  )
}
