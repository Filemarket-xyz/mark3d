import { styled } from '../../../../styles'
import { TableBody } from '../../ExplorerPage/components/Table/Table'
import { RowCell } from '../../ExplorerPage/components/TableRow/TableRow'
import { ITableColumn, ITableRow } from '../../../components/Table/TableBuilder'
import { Button } from '../../../UIkit'
import openLinkIcon from '../img/open-link-icon.svg'
import { HistoryTableBuilder } from './HistoryTableBuilder'

export const Wrapper = styled(TableBody, {
  gap: '$2',
  paddingTop: 28
})

export const ItemShareButton = styled(Button, {
  background: 'transparent',
  width: 20,
  height: 20,
  minWidth: 20,
  maxWidth: 20,
  backgroundImage: `url(${openLinkIcon})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: 0,
  margin: '$3'
})

export const RowCellStyled = styled(RowCell, {
  fontSize: '$primary3',
  fontWeight: 600,
  flexShrink: 1,
  variants: {
    title: {
      true: {
        fontSize: '$primary3'
      }
    }
  }
})

const cols: ITableColumn[] = [
  { name: 'Event', hide: false },
  { name: 'Object', hide: false },
  { name: 'From', hide: false },
  { name: 'To', hide: false },
  { name: 'Price', hide: false },
  { name: 'Date', hide: 'lg' }
]

const rows: ITableRow[] = [
  {
    cells: [
      { columnName: 'Event', value: 'Sale' },
      { columnName: 'Object', value: 'Sale' },
      { columnName: 'From', value: 'Sale' },
      { columnName: 'To', value: 'Sale' },
      { columnName: 'Price', value: 'Sale' },
      { columnName: 'Date', value: 'Some date' }
    ]
  }
]

export const HistorySection = () => {
  const historyTableBuilder = new HistoryTableBuilder(cols, rows)
  return <Wrapper>{historyTableBuilder.renderRows()}</Wrapper>
}
