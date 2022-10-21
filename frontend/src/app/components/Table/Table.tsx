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
            <ItemProperty title css={{ width: '112px' }}>
              Spatial
            </ItemProperty>
            <ItemProperty css={{ width: '174px' }}>
              Separated world
            </ItemProperty>
            <ItemProperty css={{ width: '174px' }}>Etherium</ItemProperty>
            <ItemProperty css={{ width: '174px' }}>
              .glb, .gltf, .fbx, .obj, .dae, .pcd,
            </ItemProperty>
            <ItemProperty css={{ width: '109px', marginLeft: '$3' }}>
              100 MB
              <br /> 60 MB (.dae)
              <br /> 500 MB (.zip)
            </ItemProperty>
            <ItemProperty
              css={{
                width: '50px',
                marginLeft: '$3',
                '@md': {
                  display: 'none'
                }
              }}
            >
              <CheckIcon />
            </ItemProperty>
            <ItemProperty
              css={{
                width: '109px',
                marginLeft: '$3',
                '@md': {
                  display: 'none'
                }
              }}
            >
              <CrossIcon />
            </ItemProperty>
            <ItemProperty
              css={{
                '@md': {
                  display: 'none'
                }
              }}
            >
              4/10
            </ItemProperty>
          </TableItem>
        ))}
      </TableBody>
    </TableWrapper>
  )
}
