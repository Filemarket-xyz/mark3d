import { styled } from '../../../styles'
import {
  CheckIcon,
  CrossIcon,
  ItemProperty,
  TableItem
} from './TableItem/TableItem'

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
          <TableItem key={i}>
            <ItemProperty title>Spatial</ItemProperty>
            <ItemProperty>Separated world</ItemProperty>
            <ItemProperty>Etherium</ItemProperty>
            <ItemProperty hide={'sm'}>.glb, .gltf, .fbx, .obj, .dae, .pcd,</ItemProperty>
            <ItemProperty hide={'md'}>
              100 MB
              <br /> 60 MB (.dae)
              <br /> 500 MB (.zip)
            </ItemProperty>
            <ItemProperty hide={'md'}>
              <CheckIcon />
            </ItemProperty>
            <ItemProperty hide={'md'}>
              <CrossIcon />
            </ItemProperty>
            <ItemProperty hide={'md'}>4/10</ItemProperty>
          </TableItem>
        ))}
      </TableBody>
    </TableWrapper>
  )
}
