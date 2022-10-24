import { styled } from '../../../styles'
// import TableHead from './TableHead/TableHead'
import {
  CheckIcon,
  CrossIcon,
  RowProperty,
  TableRow
} from './TableRow/TableRow'

const rowItems = [
  'Type',
  'Blockchains',
  '3D formats compatibility',
  'Max file size',
  'Show NFTs',
  'Create',
  'NFTs',
  'Visual ',
  'quality'
]

const TableWrapper = styled('div', {
  paddingTop: '$4'
})

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3'
})

const HeadItem = styled('div', {
  position: 'absolute',
  top: 'calc(-$4 - $3)',
  color: '#8F8F8F',
  fontWeight: '600'
})

function renderRowPropertiesWithHeaderItems() {
  return (
    <>
      <RowProperty title css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        Spatial
      </RowProperty>
      <RowProperty css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        Separated world
      </RowProperty>
      <RowProperty css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        Etherium
      </RowProperty>
      <RowProperty hide={'sm'} css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        .glb, .gltf, .fbx, .obj, .dae, .pcd,
      </RowProperty>
      <RowProperty hide={'md'} css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        100 MB
        <br /> 60 MB (.dae)
        <br /> 500 MB (.zip)
      </RowProperty>
      <RowProperty hide={'md'} css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        <CheckIcon />
      </RowProperty>
      <RowProperty hide={'md'} css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        <CrossIcon />
      </RowProperty>
      <RowProperty hide={'md'} css={{ position: 'relative' }}>
        <HeadItem>beb</HeadItem>
        4/10
      </RowProperty>
    </>
  )
}

function renderDefaultRowProperties() {
  return (
    <>
      <RowProperty title>Spatial</RowProperty>
      <RowProperty>Separated world</RowProperty>
      <RowProperty>Etherium</RowProperty>
      <RowProperty hide={'sm'}>
        .glb, .gltf, .fbx, .obj, .dae, .pcd,
      </RowProperty>
      <RowProperty hide={'md'}>
        100 MB
        <br /> 60 MB (.dae)
        <br /> 500 MB (.zip)
      </RowProperty>
      <RowProperty hide={'md'}>
        <CheckIcon />
      </RowProperty>
      <RowProperty hide={'md'}>
        <CrossIcon />
      </RowProperty>
      <RowProperty hide={'md'}>4/10</RowProperty>
    </>
  )
}

function renderRow(indexOfRow: number) {
  if (indexOfRow === 0) {
    return (
      <TableRow key={indexOfRow}>
        {renderRowPropertiesWithHeaderItems()}
      </TableRow>
    )
  }
  return <TableRow key={indexOfRow}>{renderDefaultRowProperties()}</TableRow>
}

export default function Table() {
  return (
    <TableWrapper>
      <TableBody>{rowItems.map((row, i) => renderRow(i))}</TableBody>
    </TableWrapper>
  )
}
