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

const cellsWithoutColumnNames2: Array<Omit<IRowCell, 'columnName'>> = [
  {
    hide: false,
    value: 'Somnium Space'
  },
  {
    hide: false,
    value: 'Separated spaces'
  },
  {
    hide: 'sm',
    value: 'Ethereum, Solana'
  },
  {
    hide: 'md',
    value: '.glb, .gltf'
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'lg',
    value: true
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'lg',
    value: '2/10'
  }
]

const cellsWithoutColumnNames3: Array<Omit<IRowCell, 'columnName'>> = [
  {
    hide: false,
    value: 'The sandbox'
  },
  {
    hide: false,
    value: 'Separated parcels'
  },
  {
    hide: 'sm',
    value: 'Ethereum, Polygon'
  },
  {
    hide: 'md',
    value: '.vox'
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
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

const cellsWithoutColumnNames4: Array<Omit<IRowCell, 'columnName'>> = [
  {
    hide: false,
    value: 'Spatial'
  },
  {
    hide: false,
    value: 'Separated spaces'
  },
  {
    hide: 'sm',
    value: 'Ethereum, Solana'
  },
  {
    hide: 'md',
    value: '.glb, .gltf, .fbx, .obj, .dae, .pcd, '
  },
  {
    hide: 'lg',
    value: (
      <>
        100mb,
        <br />
        60mb for .dae files,
        <br />
        10mb for .pcd files,
        <br />
        500mb for .zip files
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
]

const cellsWithoutColumnNames5: Array<Omit<IRowCell, 'columnName'>> = [
  {
    hide: false,
    value: 'Nvidia Omniverse'
  },
  {
    hide: false,
    value: 'Set of tools'
  },
  {
    hide: 'sm',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'md',
    value: '.usd, .usdz'
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'lg',
    value: <>🤷🏻‍♂️</>
  },
  {
    hide: 'lg',
    value: '2/10'
  }
]

const cells: IRowCell[] = cellsWithoutColumnNames.map(
  (cell, i): IRowCell => ({ ...cell, columnName: columnNames[i] })
)

const cells2: IRowCell[] = cellsWithoutColumnNames2.map(
  (cell, i): IRowCell => ({ ...cell, columnName: columnNames[i] })
)

const cells3: IRowCell[] = cellsWithoutColumnNames3.map(
  (cell, i): IRowCell => ({ ...cell, columnName: columnNames[i] })
)

const cells4: IRowCell[] = cellsWithoutColumnNames4.map(
  (cell, i): IRowCell => ({ ...cell, columnName: columnNames[i] })
)

const cells5: IRowCell[] = cellsWithoutColumnNames5.map(
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
    cells: cells2,
    content: {
      description:
        'Somnium Space is an open-source virtual reality world built on the Ethereum blockchain. It provides social activities and allows users to buy digital land, buildings, and other in-game assets.',
      imageURLS: [],
      link: 'https://somniumspace.com/'
    }
  },
  {
    title: 'The sandbox',
    cells: cells3,
    content: {
      description:
        'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
      imageURLS: [],
      link: 'https://www.sandbox.game/en/'
    }
  },
  {
    title: 'Spatial',
    cells: cells4,
    content: {
      description:
        'Spatial is a virtual reality platform with high image quality helping creators and brands build their own virtual spaces and show their NFTs.',
      imageURLS: [],
      link: 'https://spatial.io/'
    }
  },
  {
    title: 'Nvidia Omniverse',
    cells: cells5,
    content: {
      description: 'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
      imageURLS: [],
      link: 'https://www.nvidia.com/en-us/omniverse/'
    }
  }
]
