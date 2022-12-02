import { styled } from '../../../../../styles'
import { textVariant } from '../../../../UIkit'
import { ITableColumn, ITableRow } from '../../../../components/Table/TableBuilder'
import { ExplorerTableBuilder } from './ExplorerTableBuilder'

const TableWrapper = styled('div', {
  paddingTop: '$4'
})

export const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3'
})

export const HeadItem = styled('p', {
  position: 'absolute',
  bottom: 'calc($4 + $4 + $3 + $2)',
  color: '#8F8F8F',
  ...textVariant('primary1').true,
  fontSize: '12px'
})

interface Props {
  columns: ITableColumn[]
  rows: ITableRow[]
  columnsToDisplay: string[]
}

// TODO implement columnsToDisplay when filters are ready
export default function Table({ columns, rows, columnsToDisplay }: Props) {
  const table = new ExplorerTableBuilder(columns, rows)
  return (
    <TableWrapper>
      <TableBody>{table.renderRows()}</TableBody>
    </TableWrapper>
  )
}
