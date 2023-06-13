import interRegular from '../assets/fonts/Inter-Regular.ttf'
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf'
import montserratSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf'
import montserratRegular400 from '../assets/fonts/Montserrat-VariableFont_wght.ttf'
import montserratReg from '../assets/fonts/Montserrat-VariableFont_wght500.ttf'
import museoModernoSemiBold from '../assets/fonts/MuseoModerno-SemiBold.ttf'
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
    {
      fontFamily: 'MuseoModerno',
      fontStyle: 'normal',
      fontWeight: 600,
      src: `local(''), url('${museoModernoSemiBold}') format('truetype')`,
    },
  ],
  'html, body, #root, #root>div': {
    fontFamily: '$primary',
    fontSize: '$html',
    height: '100%',
  },
  a: {
    textDecoration: 'none',
  },
  html: {
    // breaks popovers
    // overflowY: 'hidden'
  },
  body: {
    overflow: 'overlay',
  },
  '*::-webkit-scrollbar, html *::-webkit-scrollbar': {
    width: '10px',
    height: '4px',
  },
  '*::-webkit-scrollbar-track, html *::-webkit-scrollbar-track': {
    background: 'none',
    boxShadow: 'inset 0 0 5px 5px #0090FF',
    border: 'solid 6px transparent',
  },

  '*::-webkit-scrollbar-thumb, html *::-webkit-scrollbar-thumb': {
    background: '#0090FF',
    borderRadius: '8px',
    border: 'solid 1px rgba(255, 255, 255, 0.5)',
  },

  '#root': {
    height: '100%',
  },
})
