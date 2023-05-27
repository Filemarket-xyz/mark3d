import interRegular from '../assets/fonts/Inter-Regular.ttf'
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf'
import montserratSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf'
import montserratRegular400 from '../assets/fonts/Montserrat-VariableFont_wght.ttf'
import montserratReg from '../assets/fonts/Montserrat-VariableFont_wght500.ttf'
import soraBold from '../assets/fonts/Sora-Bold.ttf'
import SpaceGrotesk from '../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf'
import { globalCss } from './stitches.config'

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 600,
      src: `local(''), url('${montserratSemiBold}') format('truetype')`,
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 500,
      src: `local(''), url('${montserratReg}') format('truetype')`,
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 700,
      src: `local(''), url('${montserratBold}') format('truetype')`,
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 400,
      src: `local(''), url('${montserratRegular400}') format('truetype')`,
    },
    {
      fontFamily: 'Sora',
      fontStyle: 'normal',
      fontWeight: 700,
      src: `local(''), url('${soraBold}') format('truetype')`,
    },
    {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 400,
      src: `local(''), url('${interRegular}') format('truetype')`,
    },
    {
      fontFamily: 'Space Grotesk',
      fontStyle: 'normal',
      fontWeight: 700,
      src: `local(''), url('${SpaceGrotesk}') format('truetype')`,
    },
  ],
  'html, body, #root, #root>div': {
    fontFamily: '$primary',
    fontSize: '$html',
    height: '100%',
  },
  html: {
    // breaks popovers
    // overflowY: 'hidden'
  },
  body: {
    overflow: 'overlay',
  },
  '*::-webkit-scrollbar, html *::-webkit-scrollbar': {
    width: '5px',
    height: '4px',
  },
  '*::-webkit-scrollbar-track, html *::-webkit-scrollbar-track': {
    background: 'none',
    boxShadow: 'inset 0 0 5px 5px #80C8FF',
    border: 'solid 3px transparent',
  },

  '*::-webkit-scrollbar-thumb, html *::-webkit-scrollbar-thumb': {
    background: '#80C8FF',
    borderRadius: '5px',
    boxShadow: 'inset 0 0 5px 5px #80C8FF',
    border: 'solid 3px transparent',
  },

  '#root': {
    height: '100%',
  },
})
