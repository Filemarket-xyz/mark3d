import { ComponentProps } from 'react'
import { RowWrapper, RowBody } from '../../../components/Table'
import {
  TableBuilder,
  ITableBuilder,
  ITransformedRow,
  ITableColumn,
  ITableRowCell
} from '../../../components/Table/TableBuilder'
import { HeadItem } from '../../ExplorerPage/components/Table/Table'
import { RowCellStyled, ItemShareButton } from './HistorySection'

export class HistoryTableBuilder extends TableBuilder implements ITableBuilder {
  public renderRows() {
    return this.table.rows.map((row, index) => this.renderRow(index, row))
  }

  private renderRow(rowIndex: number, row: ITransformedRow) {
    return (
      <RowWrapper
        css={{
          alignItems: 'center',
          boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
          height: 56,
          maxHeight: 56,
          minHeight: 56
        }}
        key={rowIndex}
      >
        <RowBody css={{ height: '100%' }}>
          {this.table.columns.map((column) => {
            const cell = row.row.get(column.name)
            if (!cell) return null
            return (
              <RowCellStyled
                hide={column.hide || undefined}
                {...(cell?.cellAttributes as ComponentProps<
                  typeof RowCellStyled
                >)}
                key={column.name}
              >
                {this.renderCell(column, cell, rowIndex)}
              </RowCellStyled>
            )
          })}
        </RowBody>
        <ItemShareButton to={row.additionalData.linkToPage}></ItemShareButton>
      </RowWrapper>
    )
  }

  private renderCell(column: ITableColumn, cell: ITableRowCell, index: number) {
    return (
      <>
        {index === 0 && <HeadItem css={{ bottom: 48 }}>{column.name}</HeadItem>}
        {cell?.value}
      </>
    )
  }
}
