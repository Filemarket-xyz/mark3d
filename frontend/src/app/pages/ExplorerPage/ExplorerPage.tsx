import { useState } from 'react'
import { styled } from '../../../styles'
import Table from '../../components/Table/Table'
import { textVariant } from '../../UIkit'
import { PageLayout } from '../../UIkit/PageLayout'
import { mockRows, columnNames } from './tableData'

const Title = styled('h1', {
  ...textVariant('h3').true,
  marginBottom: '$4'
})

export default function ExplorerPage() {
  // TODO use when filters are ready
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnsToDisplay, setColumnsToDisplay] =
    useState<string[]>(columnNames)
  return (
    <PageLayout>
      <Title>Metaverse explorer</Title>
      <Table rows={mockRows} columnsToDisplay={columnsToDisplay}></Table>
    </PageLayout>
  )
}
