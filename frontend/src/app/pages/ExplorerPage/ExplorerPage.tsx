import { useState } from 'react'
import Table from '../../components/Table/Table'
import { PageLayout } from '../../UIkit/PageLayout'
import { mockRows, columnNames } from './tableData'

export default function ExplorerPage() {
  // TODO use when filters are ready
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnsToDisplay, setColumnsToDisplay] = useState<string[]>(columnNames)
  return (
    <PageLayout>
      <Table rows={mockRows} columnsToDisplay={columnsToDisplay}></Table>
    </PageLayout>
  )
}
