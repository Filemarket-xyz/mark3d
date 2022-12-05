import { styled } from '../../../../styles'
import { TableBody } from '../../ExplorerPage/components/Table/Table'
import { RowCell } from '../../ExplorerPage/components/TableRow/TableRow'
import { ITableColumn, ITableRow } from '../../../components/Table/TableBuilder'
import { Button } from '../../../UIkit'
import openLinkIcon from '../img/open-link-icon.svg'
import { HistoryTableBuilder } from './HistoryTableBuilder'
import { observer } from 'mobx-react-lite'
import { useTransfersHistory } from '../../../hooks/useTransfersHistory'
import { useParams } from 'react-router-dom'
import { Params } from '../../../utils/router/Params'
import Badge from '../../../components/Badge/Badge'
import { gradientPlaceholderImg } from '../../../components/Placeholder/GradientPlaceholder'

export const Wrapper = styled(TableBody, {
  gap: '$2',
  paddingTop: 28,
  paddingBottom: '$3'
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
  { name: 'From', hide: 'md' },
  { name: 'To', hide: 'md' },
  { name: 'Price', hide: 'sm' },
  { name: 'Date', hide: 'lg' }
]

const EmptyTablePlaceholder = styled('div', {
  dflex: 'center',
  justifyContent: 'center',
  color: '$gray500',
  paddingBottom: '$3'
})

// mock rows
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rows: ITableRow[] = [
  {
    cells: [
      { columnName: 'Event', value: 'Listing' },
      {
        columnName: 'Object',
        value: (
          <Badge
            image={{
              borderRadius: 'roundedSquare',
              url: gradientPlaceholderImg
            }}
            content={{ value: '0x213...1234', title: 'VR glasses' }}
            small
            wrapperProps={{ css: { padding: 0 } }}
          />
        ),
        cellAttributes: {
          css: {
            flexGrow: 1.5
          }
        }
      },
      { columnName: 'From', value: 'Sale' },
      { columnName: 'To', value: 'Sale' },
      { columnName: 'Price', value: 'Sale' },
      {
        columnName: 'Date',
        value: 'Some date',
        cellAttributes: {
          css: {
            flexGrow: 1.5
          }
        }
      }
    ]
  },
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

export const HistorySection = observer(() => {
  const { profileAddress } = useParams<Params>()
  const { tableRows, isLoading } = useTransfersHistory(profileAddress)

  const historyTableBuilder = new HistoryTableBuilder(cols, tableRows)

  return (
    <>
      {isLoading ? (
        <EmptyTablePlaceholder>Loading</EmptyTablePlaceholder>
      ) : tableRows.length ? (
        <Wrapper>{historyTableBuilder.renderRows()}</Wrapper>
      ) : (
        <EmptyTablePlaceholder>History is empty</EmptyTablePlaceholder>
      )}
    </>
  )
})
