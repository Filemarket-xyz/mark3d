import { ComponentProps } from 'react'

import { styled } from '../../../../styles'
import { RowBody, RowWrapper } from '../../../components/Table'
import {
  ITableBuilder,
  ITableColumn,
  ITableRowCell,
  ITransformedRow,
  TableBuilder
} from '../../../components/Table/TableBuilder'
import { NavButton } from '../../../UIkit'
import { HeadItem } from '../../ExplorerPage/components/Table/Table'
import { RowCell } from '../../ExplorerPage/components/TableRow/TableRow'
import openLinkIcon from '../img/open-link-icon.svg'

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
export class HistoryTableBuilder extends TableBuilder implements ITableBuilder {
  renderRows() {
    return this.table.rows.map((row, index) => this.renderRow(index, row))
  }

  renderRow(rowIndex: number, row: ITransformedRow) {
    return (
      <RowWrapper
        key={rowIndex}
        css={{
          alignItems: 'center',
          boxShadow: '0px 0px 15px rgba(19, 19, 45, 0.05)',
          height: 56,
          maxHeight: 56,
          minHeight: 56
        }}
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
        <ItemShareButton to={row.additionalData.linkToPage} />
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
