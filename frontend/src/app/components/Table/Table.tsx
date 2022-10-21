import { styled } from '../../../styles'
import { TableItem } from './TableItem/TableItem'

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
        {rowItems.map((item, i) => (
          <TableItem title='beb' key={i}>
            <div>hi</div>
          </TableItem>
        ))}
      </TableBody>
    </TableWrapper>
  )
}
