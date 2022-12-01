import React, { ComponentProps, ReactNode } from 'react'
import { styled } from '../../../../styles'
import Badge from '../../../components/Badge/Badge'
import { gradientPlaceholderImg } from '../../../components/Placeholder/GradientPlaceholder'
import { HeadItem, TableBody } from '../../../components/Table/Table'
import {
  ItemBody as RowBody,
  ItemWrapper as RowWrapper,
  RowCell
} from '../../../components/Table/TableRow/TableRow'
import { Button } from '../../../UIkit'
import openLinkIcon from '../img/open-link-icon.svg'

const Wrapper = styled(TableBody, {
  gap: '$2',
  paddingTop: 28
})

const ItemShareButton = styled(Button, {
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

const RowCellStyled = styled(RowCell, {
  fontSize: '$primary3',
  fontWeight: 600,
  flexShrink: 1,
  variants: {
    title: {
      true: {
        fontSize: '$primary3'
      }
    }
  },
  position: 'relative'
})

// TODO rename when delete old interfaces

interface ITableColumn {
  name: string
  hide: 'sm' | 'md' | 'lg' | 'xl' | false
}

interface ITableCell {
  value: ReactNode
  columnName: string
  cellAttributes?: ComponentProps<typeof RowCellStyled>
  additionalData?: any
}

interface ITableRow {
  cells: ITableCell[]
}

/** This class provides logic to transform given data structures to more convinient and fast ones */
export class TableBuilderBase {
  protected table: {
    rows: Array<Map<string, ITableCell>>
    /** Columns to iterate to get correct cells order */
    columns: ITableColumn[]
  } = {
    columns: [],
    rows: []
  }

  constructor(
    private readonly columns: ITableColumn[],
    private readonly rows: ITableRow[]
  ) {
    this.table = {
      columns: this.columns,
      rows: this.convertRowsToMaps()
    }
    console.log('table is', this.table)
  }

  private convertRowsToMaps() {
    console.log(this.rows)
    return this.rows.map((row) => this.convertRowToMap(row))
  }

  private convertRowToMap(row: ITableRow) {
    const map = new Map<string, ITableCell>()

    this.columns.forEach(({ name: columnName }, index) => {
      const cell = row.cells.find((cell) => cell.columnName === columnName)
      if (!cell) {
        throw new Error(
          `Column name "${columnName}" in row with index ${index} was not found`
        )
      }
      map.set(columnName, cell)
    })
    return map
  }
}

export class HistoryTableBuilder extends TableBuilderBase {
  public renderRows() {
    return this.table.rows.map((row, index) => this.renderRow(index, row))
  }

  private renderRow(rowIndex: number, row: Map<string, ITableCell>) {
    return (
      <RowWrapper
        css={{
          alignItems: 'center',
          boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
          height: 56,
          maxHeight: 56,
          minHeight: 56
        }}
      >
        <RowBody>
          {this.table.columns.map((column) => {
            const cell = row.get(column.name)
            if (!cell) return null
            return (
              <RowCellStyled
                hide={column.hide || undefined}
                {...cell?.cellAttributes}
                key={column.name}
              >
                {this.renderCell(column, cell, rowIndex)}
              </RowCellStyled>
            )
          })}
        </RowBody>
        <ItemShareButton></ItemShareButton>
      </RowWrapper>
    )
  }

  /** If index is 0 renders column name inside cell and moves it to the top by positioning */
  private renderCell(column: ITableColumn, cell: ITableCell, index: number) {
    return (
      <>
        {index === 0 && <HeadItem css={{bottom: 48}}>{column.name}</HeadItem>}
        {cell?.value}
      </>
    )
  }
}

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
