import { globalCss } from './stitches.config'
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf'
import montserratSemiBold from '../assets/fonts/Montserrat-SemiBold.ttf'
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf'
import soraBold from '../assets/fonts/Sora-Bold.ttf'
import interRegular from '../assets/fonts/Inter-Regular.ttf'

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
  'html, body': {
    fontFamily: '$primary',
    fontSize: '$html',
    height: '100%'
  },
  body: {
    overflowY: 'scroll'
  },
  '#root': {
    height: '100%'
  }
})
