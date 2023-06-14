import { CSS } from '@stitches/react'

export const nftCardListCss: CSS = {
  display: 'grid',
  gridAutoRows: 'minmax(auto, 1fr)',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: '$4',
  '@xl': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
  '@lg': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '$3',
  },
  '@md': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    justifyContent: 'space-around',
  },
  '@sm': {
    justifyContent: 'center',
    gap: '$2',
  },
  '@xs': {
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  },
}
