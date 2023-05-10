import interRegular from '../assets/fonts/Inter-Regular.ttf'
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf'
import montserratRegularItalic from '../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf'
import montserratSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf'
import soraBold from '../assets/fonts/Sora-Bold.ttf'
import { globalCss } from './stitches.config'

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 400,
      src: `local(''), url('${montserratRegular}') format('truetype')`
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 600,
      src: `local(''), url('${montserratSemiBold}') format('truetype')`
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      fontWeight: 700,
      src: `local(''), url('${montserratBold}') format('truetype')`
    },
    {
      fontFamily: 'Montserrat',
      fontStyle: 'Italic',
      fontWeight: 400,
      src: `local(''), url('${montserratRegularItalic}') format('truetype')`
    },
    {
      fontFamily: 'Sora',
      fontStyle: 'normal',
      fontWeight: 700,
      src: `local(''), url('${soraBold}') format('truetype')`
    },
    {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 400,
      src: `local(''), url('${interRegular}') format('truetype')`
    }
  ],
  'html, body, #root, #root>div': {
    fontFamily: '$primary',
    fontSize: '$html',
    height: '100%'
  },
  html: {
    // breaks popovers
    // overflowY: 'hidden'
  },
  body: {
    overflow: 'overlay'
  },
  '*::-webkit-scrollbar, html *::-webkit-scrollbar': {
    width: '5px'
  },
  '*::-webkit-scrollbar-track, html *::-webkit-scrollbar-track': {
    background: 'none',
    boxShadow: 'inset 0 0 5px 5px #80C8FF',
    border: 'solid 3px transparent'
  },

  '*::-webkit-scrollbar-thumb, html *::-webkit-scrollbar-thumb': {
    background: '#80C8FF',
    borderRadius: '5px',
    boxShadow: 'inset 0 0 5px 5px #80C8FF',
    border: 'solid 3px transparent'
  },

  '#root': {
    height: '100%'
  }
})
