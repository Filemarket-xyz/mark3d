import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { styled } from '../../../../styles'
import { ITableColumn } from '../../../components/Table/TableBuilder'
import { useTransfersHistory } from '../../../hooks/useTransfersHistory'
import { NavButton } from '../../../UIkit'
import { Params } from '../../../utils/router/Params'
import { TableBody } from '../../ExplorerPage/components/Table/Table'
import { RowCell } from '../../ExplorerPage/components/TableRow/TableRow'
import openLinkIcon from '../img/open-link-icon.svg'
import { HistoryTableBuilder } from './HistoryTableBuilder'

export const Wrapper = styled(TableBody, {
  gap: '$2',
  paddingTop: 28,
  paddingBottom: '$3'
})

export const ItemShareButton = styled(NavButton, {
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

export const EmptyTablePlaceholder = styled('div', {
  dflex: 'center',
  justifyContent: 'center',
  color: '$gray500',
  paddingBottom: '$3'
})

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
