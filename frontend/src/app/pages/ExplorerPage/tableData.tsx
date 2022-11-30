import { IRow, IRowCell } from '../../components/Table/utils/tableBuilder'

// Spatial imgs
import sp1 from './images/Spatial/1.jpg'
import sp2 from './images/Spatial/2.jpg'
import sp3 from './images/Spatial/3.jpg'
import sp4 from './images/Spatial/4.jpg'
import sp5 from './images/Spatial/5.jpg'
import sp6 from './images/Spatial/6.jpg'
import sp7 from './images/Spatial/7.jpg'
import sp8 from './images/Spatial/8.jpg'
import sp9 from './images/Spatial/9.jpg'
import sp10 from './images/Spatial/10.jpg'

// Somnium imgs
import sm1 from './images/Somnium/1.jpg'

// Decentraland imgs
import dc1 from './images/Decentraland/1.jpg'
import dc2 from './images/Decentraland/2.jpg'
import dc3 from './images/Decentraland/3.jpg'
import dc4 from './images/Decentraland/4.jpg'
import dc5 from './images/Decentraland/5.jpg'
import dc6 from './images/Decentraland/6.jpg'
import dc7 from './images/Decentraland/7.jpg'
import dc8 from './images/Decentraland/8.jpg'

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
      imageURLS: [dc1, dc2, dc3, dc4, dc5, dc6, dc7, dc8],
      link: 'https://decentraland.org/'
    }
  },
  {
    title: 'Somnium Space',
    cells: cells2,
    content: {
      description:
        'Somnium Space is an open-source virtual reality world built on the Ethereum blockchain. It provides social activities and allows users to buy digital land, buildings, and other in-game assets.',
      imageURLS: [sm1],
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
      imageURLS: [sp1, sp2, sp3, sp4, sp5, sp6, sp7, sp8, sp9, sp10],
      link: 'https://spatial.io/'
    }
  },
  {
    title: 'Nvidia Omniverse',
    cells: cells5,
    content: {
      description:
        'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
      imageURLS: [],
      link: 'https://www.nvidia.com/en-us/omniverse/'
    }
  }
]
