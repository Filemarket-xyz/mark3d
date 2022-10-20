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

const _Table = styled('div')

const TableHead = styled('div', {
  color: '$lightGray'
})

export default function Table () {
  return (
    <_Table>
        <TableHead>
            {headItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
        </TableHead>
        <div className="table__body">
            <div className="table__row">
                {rowItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
            </div>
        </div>
    </_Table>

  )
}
