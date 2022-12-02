import {
  ITableColumn,
  ITableRow
} from '../../components/Table/TableBuilder'

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

// OnCyber
import oc1 from './images/OnCyber/1.jpg'
import oc2 from './images/OnCyber/2.jpg'

export const columns: ITableColumn[] = [
  {
    name: 'Name',
    hide: false
  },
  {
    name: 'Type',
    hide: false
  },
  {
    name: 'Blockchains',
    hide: 'sm'
  },
  {
    name: '3D formats compatibility',
    hide: 'md'
  },
  {
    name: 'Max file size',
    hide: 'lg'
  },
  {
    name: 'Show NFTs',
    hide: 'lg'
  },
  {
    name: 'Create NFTs',
    hide: 'lg'
  },
  {
    name: 'Visual quality',
    hide: 'lg'
  }
]

export const rows: ITableRow[] = [
  {
    cells: [
      {
        columnName: 'Name',
        value: 'Decentraland'
      },
      {
        columnName: 'Type',
        value: 'Separated World'
      },
      {
        columnName: 'Blockchains',
        value: 'Etherium, Polygon'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: (
          <>
            15mb per parcel
            <br />
            200 files per parcel
          </>
        )
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: true
      },
      {
        columnName: 'Visual quality',
        value: '3/10'
      }
    ],
    additionalData: {
      title: 'Decentraland',
      content: {
        description:
          'The Decentraland Metaverse is a decentralised virtual reality platform built on the Ethereum blockchain. Decentraland is accessed through a browser, desktop version or VR headset, which allows the visitor to be in a space with a 360-degree view.',
        imageURLS: [dc1, dc2, dc3, dc4, dc5, dc6, dc7, dc8],
        link: 'https://decentraland.org/'
      }
    }
  },
  {
    cells: [
      {
        columnName: 'Name',
        value: 'Somnium Space'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'Ethereum, Solana'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Visual quality',
        value: '2/10'
      }
    ],
    additionalData: {
      title: 'Somnium Space',
      content: {
        description:
          'Somnium Space is an open-source virtual reality world built on the Ethereum blockchain. It provides social activities and allows users to buy digital land, buildings, and other in-game assets.',
        imageURLS: [sm1],
        link: 'https://somniumspace.com/'
      }
    }
  },
  {
    cells: [
      {
        columnName: 'Name',
        value: 'The sandbox'
      },
      {
        columnName: 'Type',
        value: 'Separated parcels'
      },
      {
        columnName: 'Blockchains',
        value: 'Ethereum, Polygon'
      },
      {
        columnName: '3D formats compatibility',
        value: '.vox'
      },
      {
        columnName: 'Max file size',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: true
      },
      {
        columnName: 'Visual quality',
        value: '3/10'
      }
    ],
    additionalData: {
      title: 'The sandbox',

      content: {
        description:
          'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
        imageURLS: [],
        link: 'https://www.sandbox.game/en/'
      }
    }
  },
  {
    cells: [
      {
        columnName: 'Name',
        value: 'Spatial'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'Ethereum, Solana'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf, .fbx, .obj, .dae, .pcd, '
      },
      {
        columnName: 'Max file size',
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
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: false
      },
      {
        columnName: 'Visual quality',
        value: '4/10'
      }
    ],
    additionalData: {
      title: 'Spatial',
      content: {
        description:
          'Spatial is a virtual reality platform with high image quality helping creators and brands build their own virtual spaces and show their NFTs.',
        imageURLS: [sp1, sp2, sp3, sp4, sp5, sp6, sp7, sp8, sp9, sp10],
        link: 'https://spatial.io/'
      }
    }
  },
  {
    cells: [
      {
        columnName: 'Name',
        value: 'Nvidia Omniverse'
      },
      {
        columnName: 'Type',
        value: 'Set of tools'
      },
      {
        columnName: 'Blockchains',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: '3D formats compatibility',
        value: '.usd, .usdz'
      },
      {
        columnName: 'Max file size',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Show NFTs',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Create NFTs',
        value: <>🤷🏻‍♂️</>
      },
      {
        columnName: 'Visual quality',
        value: '2/10'
      }
    ],
    additionalData: {
      title: 'Nvidia Omniverse',
      content: {
        description:
          'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
        imageURLS: [],
        link: 'https://www.nvidia.com/en-us/omniverse/'
      }
    }
  },
  {
    cells: [
      {
        columnName: 'Name',
        value: 'OnCyber'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'Ethereum, Polygon, Solana, Tezos, Klaytn'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: <>40mb</>
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: false
      },
      {
        columnName: 'Visual quality',
        value: '5/10'
      }
    ],
    additionalData: {
      title: 'OnCyber',
      content: {
        description:
          'Oncyber is a free virtual reality platform with high image quality that aims to help 3D artists to display their NFTs with fully immersive 3D experiences',
        imageURLS: [oc1, oc2],
        link: 'https://oncyber.io/'
      }
    }
  }
]
