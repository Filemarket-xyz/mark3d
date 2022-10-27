import Table from '../../components/Table/Table'
import { PageLayout } from '../../UIkit/PageLayout'
import { headerItems, mockRows } from './tableData'

export default function ExplorerPage() {
  return (
    <PageLayout>
      <Table headItems={headerItems} rows={mockRows}></Table>
    </PageLayout>
  )
}
