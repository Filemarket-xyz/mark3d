import { ReactNode } from 'react'
import {
  TableRow,
  CheckIcon,
  CrossIcon,
  RowCell
} from '../TableRow/TableRow'
import { HeadItem } from '../Table'

export interface IRowCell {
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
}

export class TableBuilder {
  constructor(
    private readonly headItems: string[],
    private readonly rows: IRow[]
  ) {}

  public renderRows() {
    return this.rows.map((rowCells, index) => this.renderRow(index, rowCells.cells))
  }

  private renderRow(rowId: number, rowCells: IRowCell[]) {
    if (rowId === 0) {
      return (
        <TableRow key={rowId}>
          {this.renderFirstRow(rowCells, this.headItems)}
        </TableRow>
      )
    }
    return <TableRow key={rowId}>{this.renderDefaultRow(rowCells)}</TableRow>
  }

  private renderFirstRow(cells: IRowCell[], headItems: string[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {cells.map((p, index) => {
          return (
            <RowCell
              title={index === 0}
              key={index}
              css={{ position: 'relative' }}
              {...(p.hide && { hide: p.hide })}
            >
              <HeadItem>{headItems[index]}</HeadItem>
              {renderProp(p.value)}
            </RowCell>
          )
        })}
      </>
    )
  }

  private renderDefaultRow(cells: IRowCell[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {cells.map((p, index) => {
          return (
            <RowCell
              title={index === 0}
              key={index}
              css={{ position: 'relative' }}
              {...(p.hide && { hide: p.hide })}
            >
              {renderProp(p.value)}
            </RowCell>
          )
        })}
      </>
    )
  }
}
