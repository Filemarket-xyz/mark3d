import { ReactNode } from 'react'

import {
  ITableBuilder,
  ITableRowCell,
  ITransformedRow,
  TableBuilder
} from '../../../../components/Table/TableBuilder'
import { CheckIcon, CrossIcon, RowCell, TableRow } from '../TableRow/TableRow'
import { HeadItem } from './Table'

export class ExplorerTableBuilder
  extends TableBuilder
  implements ITableBuilder {
  public renderRows() {
    return this.table.rows.map((row, index) => this.renderRow(index, row))
  }

  private renderRow(rowIndex: number, row: ITransformedRow) {
    return (
      <TableRow
        content={row.additionalData.content}
        contentTitle={row.additionalData.title}
        key={rowIndex}
      >
        {this.renderCells(row.row, rowIndex)}
      </TableRow>
    )
  }

  private renderCells(row: Map<string, ITableRowCell>, rowIndex: number) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {this.table.columns.map((column, index) => {
          const cell = row.get(column.name)
          if (!cell) return null
          return (
            <RowCell
              title={index === 0}
              hide={column.hide || undefined}
              {...cell.cellAttributes}
              key={column.name}
            >
              {rowIndex === 0 && <HeadItem>{cell.columnName}</HeadItem>}
              {renderProp(cell.value)}
            </RowCell>
          )
        })}
      </>
    )
  }
}
