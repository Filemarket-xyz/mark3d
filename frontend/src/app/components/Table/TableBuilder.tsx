import { ComponentProps, ReactNode } from 'react'
import { RowCell } from '../../pages/ExplorerPage/components/TableRow/TableRow'

// TODO also need to implement 'column attributes: to apply css not on one cell but on full column'
/** Describes column in table */
export interface ITableColumn {
  name: string
  hide: 'sm' | 'md' | 'lg' | 'xl' | false
}

/** Describes row in table */
export interface ITableRow<AdditionalDataCellType = {}, AdditionalDataRowType = {}> {
  cells: Array<ITableRowCell<AdditionalDataCellType>>
  additionalData?: AdditionalDataRowType
}

/** Describes cell in row in table */
export interface ITableRowCell<AdditionalDataType = {}> {
  value: ReactNode
  columnName: string
  cellAttributes?: ComponentProps<typeof RowCell>
  additionalData?: AdditionalDataType
}

/** Describes row after transformation */
export interface ITransformedRow {
  row: Map<string, ITableRowCell>
  additionalData?: any
}

/** Each table builder should implement this interface to be more consistent to others */
export interface ITableBuilder {
  renderRows: () => JSX.Element[]
}

/** This class provides logic to transform given data structures to more convinient and fast ones */
export class TableBuilder {
  protected table: {
    rows: ITransformedRow[]
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
      rows: this.convertRowsToMapsWithAdditionalData()
    }
  }

  private convertRowsToMapsWithAdditionalData() {
    return this.rows.map((row) => ({
      row: this.convertRowToMap(row),
      additionalData: row.additionalData
    }))
  }

  private convertRowToMap(row: ITableRow) {
    const map = new Map<string, ITableRowCell>()

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
