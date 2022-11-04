import { IRow, IRowCell } from '../../components/Table/utils/tableBuilder'

export const columnNames = [
  'Name',
  'Type',
  'Blockchains',
  '3D formats compatibility',
  'Max file size',
  'Show NFTs',
  'Create NFTs',
  'Visual quality'
]

const cellsWithoutColumnNames: Array<Omit<IRowCell, 'columnName'>> = [
  {
    hide: false,
    value: 'Decentraland'
  },
  {
    hide: false,
    value: 'Separated World'
  },
  {
    hide: 'sm',
    value: 'Etherium, Polygon'
  },
  {
    hide: 'md',
    value: '.glb, .gltf'
  },
  {
    hide: 'lg',
    value: (
      <>
        15mb per parcel
        <br />
        200 files per parcel
      </>
    )
  },
  {
    hide: 'lg',
    value: true
  },
  {
    hide: 'lg',
    value: true
  },
  {
    hide: 'lg',
    value: '3/10'
  }
]

const cells: IRowCell[] = cellsWithoutColumnNames.map(
  (cell, i): IRowCell => ({ ...cell, columnName: columnNames[i] })
)

export const mockRows: IRow[] = [
  {
    title: 'Decentraland',
    cells,
    content: {
      description:
        'The Decentraland Metaverse is a decentralised virtual reality platform built on the Ethereum blockchain. Decentraland is accessed through a browser, desktop version or VR headset, which allows the visitor to be in a space with a 360-degree view.',
      imageURLS: [],
      link: 'https://decentraland.org/'
    }
  },
  {
    title: 'Somnium Space',
    cells,
    content: {
      description:
        'Somnium Space is an open-source virtual reality world built on the Ethereum blockchain. It provides social activities and allows users to buy digital land, buildings, and other in-game assets.',
      imageURLS: [],
      link: 'https://somniumspace.com/'
    }
  },
  {
    title: 'Spatial',
    cells,
    content: {
      description:
        'Spatial is a virtual reality platform with high image quality helping creators and brands build their own virtual spaces and show their NFTs.',
      imageURLS: [],
      link: 'https://spatial.io/'
    }
  },
  {
    title: 'Nvidia Omniverse',
    cells,
    content: {
      description: 'Nvidia Omniverse',
      imageURLS: [],
      link: 'https://www.nvidia.com/en-us/omniverse/'
    }
  }
]
