import Table from '../../components/Table/Table'
import {
  RowProp,
  TableBuilder
} from '../../components/Table/utils/tableBuilder'
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
    hide: 'sm',
    value: 'Etherium'
  },
  {
    hide: 'md',
    value: '.glb, .gltf, .fbx, .obj, .dae, .pcd, '
  },
  {
    hide: 'lg',
    value: (
      <>
        100 MB
        <br />
        60 MB (.dae) <br />
        500 MB (.zip)
      </>
    )
  },
  {
    hide: 'lg',
    value: true
  },
  {
    hide: 'lg',
    value: false
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
      <Table>{table.renderRows()}</Table>
    </PageLayout>
  )
}
