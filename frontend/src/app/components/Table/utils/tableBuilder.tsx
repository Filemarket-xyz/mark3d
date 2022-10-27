import { ReactNode } from 'react'
import { TableRow, CheckIcon, CrossIcon, RowCell } from '../TableRow/TableRow'
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
    console.log(this.rows[0].content.imageURLS)

    return this.rows.map((row, index) => this.renderRow(index, row))
  }

  private renderRow(rowId: number, row: IRow) {
    if (rowId === 0) {
      return (
        <TableRow content={row.content} contentTitle={row.title} key={rowId}>
          {this.renderRowPropsWithHeaderItems(row.cells, this.headItems)}
        </TableRow>
      )
    }
    return (
      <TableRow content={row.content} contentTitle={row.title} key={rowId}>
        {this.renderRowProps(row.cells)}
      </TableRow>
    )
  }

  private renderRowPropsWithHeaderItems(
    cells: IRowCell[],
    headItems: string[]
  ) {
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

  private renderRowProps(cells: IRowCell[]) {
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
