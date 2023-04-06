import { ITableColumn, ITableRow } from '../../components/Table/TableBuilder'

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

// OnCyber imgs
import oc1 from './images/OnCyber/1.jpg'
import oc2 from './images/OnCyber/2.jpg'

// 3XR imgs
import xr1 from './images/3XR/1.jpg'
import xr2 from './images/3XR/2.jpg'
import xr3 from './images/3XR/3.jpg'
import xr4 from './images/3XR/4.jpg'

// Arhead imgs
import ah1 from './images/Arhead/1.jpg'
import ah2 from './images/Arhead/2.jpg'
import ah3 from './images/Arhead/3.jpg'
import ah4 from './images/Arhead/4.jpg'

// Sandbox imgs
import sb1 from './images/Sandbox/1.jpg'
import sb2 from './images/Sandbox/2.jpg'
import sb3 from './images/Sandbox/3.jpg'
import sb4 from './images/Sandbox/4.jpg'

// Viverse imgs
import vv1 from './images/Viverse/1.jpg'
import vv2 from './images/Viverse/2.jpg'
import vv3 from './images/Viverse/3.jpg'
import vv4 from './images/Viverse/4.jpg'

// Voxels imgs
import vx1 from './images/Voxels/1.jpg'
import vx2 from './images/Voxels/2.jpg'
import vx3 from './images/Voxels/3.jpg'
import vx4 from './images/Voxels/4.jpg'
import vx5 from './images/Voxels/5.jpg'

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
        value: 'coming soon'
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
        value: 'Voxels'
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
        value: '.vox'
      },
      {
        columnName: 'Max file size',
        value: 'no data'
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: 'no data'
      },
      {
        columnName: 'Visual quality',
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: 'Voxels',
      content: {
        description:
          'The Voxels, formerly known as Cryptovoxels, is a virtual world built on the Ethereum blockchain. The players of the Voxels metaverse can create customised avatars, buy digital land and interact with other players',
        imageURLS: [vx1, vx2, vx3, vx4, vx5],
        link: 'https://www.voxels.com/'
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
        value: 'no data'
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
        value: 'coming soon'
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
        value: 'coming soon'
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
        value: 'no data'
      },
      {
        columnName: 'Show NFTs',
        value: true
      },
      {
        columnName: 'Create NFTs',
        value: 'no data'
      },
      {
        columnName: 'Visual quality',
        value: 'coming soon'
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
        value: 'coming soon'
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
  },

  {
    cells: [
      {
        columnName: 'Name',
        value: 'Viverse'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'Ethereum, Polygon'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: '50mb'
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
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: 'Viverse',
      content: {
        description:
          'Viverse is a decentralised virtual reality platform focused on social activity and private digital life',
        imageURLS: [vv1, vv2, vv3, vv4],
        link: 'https://www.viverse.com/us'
      }
    }
  },

  {
    cells: [
      {
        columnName: 'Name',
        value: 'Arhead'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'Polygon, (coming soon NEAR)'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf, .fbx'
      },
      {
        columnName: 'Max file size',
        value: '50mb, 10mb for images, 300mb for videos'
      },
      {
        columnName: 'Show NFTs',
        value: false
      },
      {
        columnName: 'Create NFTs',
        value: false
      },
      {
        columnName: 'Visual quality',
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: 'Arhead',
      content: {
        description:
          'Arhead is a creators driven virtual platform to produce content, spaces and events in the metaverse with high image quality',
        imageURLS: [ah1, ah2, ah3, ah4],
        link: 'https://arhead.io/'
      }
    }
  },

  {
    cells: [
      {
        columnName: 'Name',
        value: '3XR'
      },
      {
        columnName: 'Type',
        value: 'Separated spaces'
      },
      {
        columnName: 'Blockchains',
        value: 'NEAR'
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: 'no data'
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
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: '3XR',
      content: {
        description:
          '3XR is a virtual shop which is connecting the spatial web with digital tokens where you can mint your own gallery',
        imageURLS: [xr1, xr2, xr3, xr4],
        link: 'https://3xr.space/'
      }
    }
  },

  {
    cells: [
      {
        columnName: 'Name',
        value: 'Varjo Reality Cloud'
      },
      {
        columnName: 'Type',
        value: 'Set of tools'
      },
      {
        columnName: 'Blockchains',
        value: false
      },
      {
        columnName: '3D formats compatibility',
        value: '.glb, .gltf'
      },
      {
        columnName: 'Max file size',
        value: 'no data'
      },
      {
        columnName: 'Show NFTs',
        value: 'no data'
      },
      {
        columnName: 'Create NFTs',
        value: 'no data'
      },
      {
        columnName: 'Visual quality',
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: 'Varjo Reality Cloud',
      content: {
        description:
          'The Varjo Reality Cloud platform drastically simplifies VR and XR software use, and the hardware required to run it, empowering professionals of all skill levels to engage in the future of virtual collaboration.',
        imageURLS: [],
        link: 'https://varjo.com/products/realitycloud/'
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
        value: 'no data'
      },
      {
        columnName: '3D formats compatibility',
        value: '.usd, .usdz'
      },
      {
        columnName: 'Max file size',
        value: 'no data'
      },
      {
        columnName: 'Show NFTs',
        value: 'no data'
      },
      {
        columnName: 'Create NFTs',
        value: 'no data'
      },
      {
        columnName: 'Visual quality',
        value: 'coming soon'
      }
    ],
    additionalData: {
      title: 'Nvidia Omniverse',
      content: {
        description:
          'The Sandbox Game is a decentralised gaming virtual world built on the Ethereum blockchain. It allows non-tech-savvy users to create, sell, use, and monetise their VOX NFTs. The game is a vast map divided into parcels of land that are not connected.',
        imageURLS: [sb1, sb2, sb3, sb4],
        link: 'https://www.nvidia.com/en-us/omniverse/'
      }
    }
  }
]
