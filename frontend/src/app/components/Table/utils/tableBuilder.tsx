import { ReactNode } from 'react'
import {
  TableRow,
  CheckIcon,
  CrossIcon,
  RowProperty
} from '../TableRow/TableRow'
import { HeadItem } from '../Table'

export interface RowProp {
  hide: 'sm' | 'md' | 'lg' | 'xl' | false
  value: ReactNode
}

export class TableBuilder {
  constructor(
    private readonly headItems: string[],
    private readonly rows: RowProp[][]
  ) {}

  public renderRows() {
    return this.rows.map((rowProps, index) => this.renderRow(index, rowProps))
  }

  private renderRow(rowId: number, rowProps: RowProp[]) {
    if (rowId === 0) {
      return (
        <TableRow key={rowId}>
          {this.renderFirstRow(rowProps, this.headItems)}
        </TableRow>
      )
    }
    return <TableRow key={rowId}>{this.renderDefaultRow(rowProps)}</TableRow>
  }

  private renderFirstRow(props: RowProp[], headItems: string[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {props.map((p, index) => {
          return (
            <RowProperty
              title={index === 0}
              key={index}
              css={{ position: 'relative' }}
              {...(p.hide && { hide: p.hide })}
            >
              <HeadItem>{headItems[index]}</HeadItem>
              {renderProp(p.value)}
            </RowProperty>
          )
        })}
      </>
    )
  }

  private renderDefaultRow(props: RowProp[]) {
    const renderProp = (value: ReactNode) => {
      if (typeof value === 'boolean') {
        return value ? <CheckIcon /> : <CrossIcon />
      }
      return value
    }
    return (
      <>
        {props.map((p, index) => {
          return (
            <RowProperty
              title={index === 0}
              key={index}
              css={{ position: 'relative' }}
              {...(p.hide && { hide: p.hide })}
            >
              {renderProp(p.value)}
            </RowProperty>
          )
        })}
      </>
    )
  }
}
