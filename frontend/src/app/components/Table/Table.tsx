import { styled } from '../../../styles'

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

const TableBody = styled('div')

export default function Table () {
  return (
    <TableWrapper>
        <TableHead>
            {headItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
        </TableHead>
        <TableBody>
          <div className="table__row">
            {rowItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
          </div>
        </TableBody>
    </TableWrapper>

  )
}
