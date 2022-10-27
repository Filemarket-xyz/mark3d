import { styled } from '../../../styles'
import { IRow, TableBuilder } from './utils/tableBuilder'

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

interface Props {
  rows: IRow[]
  headItems: string[]
}

export default function Table({ rows, headItems }: Props) {
  const table = new TableBuilder(headItems, rows)
  return (
    <TableWrapper>
      <TableBody>{table.renderRows()}</TableBody>
    </TableWrapper>
  )
}
