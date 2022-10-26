import Table from '../../components/Table/Table'
import {
  IRow,
  TableBuilder
} from '../../components/Table/utils/tableBuilder'
import { PageLayout } from '../../UIkit/PageLayout'

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

const mockRows: IRow[] = [
  {
    title: 'Spatial',
    cells: [
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
    ],
    content: {
      description:
        'Spatial is dedicated to helping creators and brands build their own spaces in the metaverse to share culture together. We empower our users to leverage their beautiful spaces to share eye popping content, build a tight knit community, and drive meaningful sales of their creative works and products. We also empower our users to create beautiful and functional 3D spaces that they can mint as NFTs and sell/rent to others looking to host mind blowing experiences.',
      imageURLS: []
    }
  }
]

export default function ExplorerPage() {
  const table = new TableBuilder(headerItems, mockRows)
  return (
    <PageLayout>
      <Table>{table.renderRows()}</Table>
    </PageLayout>
  )
}
