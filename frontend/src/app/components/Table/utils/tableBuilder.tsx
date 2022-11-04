import { ReactNode } from 'react'
import { TableRow, CheckIcon, CrossIcon, RowCell } from '../TableRow/TableRow'
import { HeadItem } from '../Table'

export interface IRowCell {
  columnName: string
  hide: 'sm' | 'md' | 'lg' | 'xl' | false
  value: ReactNode
}

export interface IRow {
  title: string
  cells: IRowCell[]
  content: IRowContent
}

/** Defines content when row is expanded */
export interface IRowContent {
  description: string
  imageURLS: string[]
  link: string
}

export class TableBuilder {
  constructor(
    private readonly rows: IRow[],
    private readonly columnsToDisplay: string[]
  ) {}

  public renderRows() {
    return this.rows.map((row, index) => this.renderRow(index, row))
  }

  private renderRow(rowId: number, row: IRow) {
    const isRowFirst = rowId === 0

    if (isRowFirst) {
      return (
        <TableRow content={row.content} contentTitle={row.title} key={rowId}>
          {this.renderRowPropsWithColumnNames(row.cells)}
        </TableRow>
      )
    }
    return (
      <TableRow content={row.content} contentTitle={row.title} key={rowId}>
        {this.renderRowProps(row.cells)}
      </TableRow>
    )
  }

  private renderRowPropsWithColumnNames(cells: IRowCell[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {cells.map((cell, index) => {
          return (
            this.columnsToDisplay.includes(cell.columnName) && (
              <RowCell
                title={index === 0}
                key={index}
                css={{ position: 'relative' }}
                {...(cell.hide && { hide: cell.hide })}
              >
                <HeadItem>{cell.columnName}</HeadItem>
                {renderProp(cell.value)}
              </RowCell>
            )
          )
        })}
      </>
    )
  }

  private renderRowProps(cells: IRowCell[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {cells.map((cell, index) => {
          return (
            this.columnsToDisplay.includes(cell.columnName) && (
              <RowCell
                title={index === 0}
                key={index}
                css={{ position: 'relative' }}
                {...(cell.hide && { hide: cell.hide })}
              >
                {renderProp(cell.value)}
              </RowCell>
            )
          )
        })}
      </>
    )
  }
}
