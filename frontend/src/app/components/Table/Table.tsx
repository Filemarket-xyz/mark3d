import { styled } from '../../../styles'
import {
  CheckIcon,
  CrossIcon,
  RowProperty,
  TableRow
} from './TableRow/TableRow'

const headItems = [
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

const TableWrapper = styled('div')

const TableHead = styled('div', {
  color: '#8F8F8F'
})

const TableBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3'
})

export default function Table() {
  return (
    <TableWrapper>
      <TableHead>
        {headItems.map((item, i) => (
          <div className='head__item' key={i}>
            {item}
          </div>
        ))}
      </TableHead>
      <TableBody>
        {rowItems.map((row, i) => (
          <TableRow key={i}>
            <RowProperty title>Spatial</RowProperty>
            <RowProperty>Separated world</RowProperty>
            <RowProperty>Etherium</RowProperty>
            <RowProperty hide={'sm'}>.glb, .gltf, .fbx, .obj, .dae, .pcd,</RowProperty>
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
          </TableRow>
        ))}
      </TableBody>
    </TableWrapper>
  )
}
