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

export default function Table () {
  return (
    <div className="table">
        <div className="table__head">
            {headItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
        </div>
        <div className="table__body">
            <div className="table__row">
                {rowItems.map((item, i) => <div className="head__item" key={i}>{item}</div>)}
            </div>
        </div>
    </div>
  )
}
