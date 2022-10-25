import Table from '../../components/Table/Table'
import { RowProp, TableBuilder } from '../../components/Table/utils/tableBuilder'
import { PageLayout } from '../../UIkit/PageLayout'

const testProps: RowProp[] = [
  {
    hide: false,
    value: 'Spatial'
  },
  {
    hide: false,
    value: 'Separated World'
  },
  {
    hide: false,
    value: 'Etherium'
  },
  {
    hide: false,
    value: 'Etherium'
  },
  {
    hide: 'lg',
    value: 'Etherium'
  },
  {
    hide: 'lg',
    value: 'Etherium'
  },
  {
    hide: 'lg',
    value: 'Etherium'
  },
  {
    hide: 'lg',
    value: '4/10'
  }
]

const headerItems = [
  'Name',
  'Type',
  'Blockchains',
  '3D formats compatibility',
  'Max file size',
  'Show NFTs',
  'Create NFTs',
  'Visual quality'
]

export default function ExplorerPage() {
  const table = new TableBuilder(headerItems, [testProps])
  return (
    <PageLayout>
      <Table>
        {table.renderRows()}
      </Table>
    </PageLayout>
  )
}
