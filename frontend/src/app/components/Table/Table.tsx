import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'
import { IRow, TableBuilder } from './utils/tableBuilder'

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
  bottom: 'calc($4 + $4 + $3)',
  color: '#8F8F8F',
  ...textVariant('primary1').true,
  fontSize: '12px'
})

interface Props {
  rows: IRow[]
  columnsToDisplay: string[]
}

export default function Table({ rows, columnsToDisplay }: Props) {
  const table = new TableBuilder(rows, columnsToDisplay)
  return (
    <TableWrapper>
      <TableBody>{table.renderRows()}</TableBody>
    </TableWrapper>
  )
}
